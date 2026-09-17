import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, getSetting, notify } from "./platform.server";
import type { PaymentSettings } from "./platform.server";

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30)
    .superRefine((items, ctx) => {
      const ids = new Set<string>();
      for (const item of items) {
        if (ids.has(item.productId)) {
          ctx.addIssue({ code: "custom", path: ["items"], message: "Duplicate products are not allowed in checkout." });
          break;
        }
        ids.add(item.productId);
      }
    }),
  referralCode: z.string().trim().max(32).optional().nullable(),
  referralVisitorId: z.string().uuid().optional().nullable(),
  shippingName: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^[0-9]{10}$/),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^[0-9]{6}$/),
});

async function createRazorpayOrder(amountInr: number, receipt: string) {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: Math.round(amountInr * 100), currency: "INR", receipt, payment_capture: 1 }),
  });
  const payload = (await response.json()) as { id?: string; amount?: number; currency?: string; error?: { description?: string } };
  if (!response.ok || !payload.id) throw new Error(payload.error?.description ?? "Could not create Razorpay order.");
  if (payload.amount !== Math.round(amountInr * 100) || payload.currency !== "INR") {
    throw new Error("Razorpay returned an unexpected order amount.");
  }
  return payload;
}

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${orderId}|${paymentId}`));
  const expected = Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}

/** Returns only the signed-in customer's own order, items, and payment ledger. */
export const getCustomerOrderDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: order, error } = await db
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .eq("customer_id", context.userId)
      .maybeSingle();
    if (error || !order) return { ok: false as const };

    const [{ data: items }, { data: transactions }] = await Promise.all([
      db.from("order_items").select("*").eq("order_id", order.id).order("created_at", { ascending: true }),
      db.from("transactions").select("id,order_id,amount,currency,gateway,payment_type,gateway_order_id,gateway_payment_id,status,created_at,updated_at").eq("order_id", order.id).eq("user_id", context.userId).order("created_at", { ascending: true }),
    ]);

    return {
      ok: true as const,
      order,
      items: items ?? [],
      transactions: transactions ?? [],
    };
  });

/** Prices, totals and referral attribution are resolved atomically by the database RPC. */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: result, error } = await db.rpc("create_order", {
      _customer_id: context.userId,
      _items: data.items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
      _referral_code: data.referralCode ?? null,
      _referral_visitor_id: data.referralVisitorId ?? null,
      _shipping_name: data.shippingName,
      _mobile: data.mobile,
      _address: data.address,
      _city: data.city,
      _state: data.state,
      _pincode: data.pincode,
    });

    const order = result?.[0];
    if (error || !order) {
      const message = error?.message?.toLowerCase().includes("no longer available")
        ? "One or more products are no longer available."
        : "Could not create your order.";
      return { ok: false as const, error: message };
    }

    const payment = await getSetting<PaymentSettings>("payment", { provider: "razorpay", demo_mode: true });
    const receipt = `order_${order.order_number}`;
    let gatewayOrderId = `demo_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    let gateway = "demo";

    try {
      if (!payment.demo_mode) {
        const gatewayOrder = await createRazorpayOrder(order.total, receipt);
        gatewayOrderId = gatewayOrder.id!;
        gateway = "razorpay";
      }

      const { error: txError } = await db.from("transactions").insert({
        user_id: context.userId,
        order_id: order.order_id,
        amount: order.total,
        currency: "INR",
        gateway,
        payment_type: "order",
        gateway_order_id: gatewayOrderId,
        status: "created",
      });
      if (txError) throw new Error(txError.message);
    } catch (error) {
      await db.rpc("delete_unpaid_order", { _order_id: order.order_id });
      return { ok: false as const, error: error instanceof Error ? error.message : "Could not start payment." };
    }

    return {
      ok: true as const,
      orderId: order.order_id,
      orderNumber: order.order_number,
      total: order.total,
      demoMode: payment.demo_mode,
      gatewayOrderId,
      razorpayKeyId: payment.demo_mode ? null : process.env["RAZORPAY_KEY_ID"] ?? null,
    };
  });

/** Verifies Razorpay first, then atomically marks the order paid and deducts stock. */
export const payForOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      gatewayOrderId: z.string().min(6),
      gatewayPaymentId: z.string().min(6).optional(),
      signature: z.string().min(10).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: order } = await db.from("orders").select("*").eq("id", data.orderId).eq("customer_id", context.userId).maybeSingle();
    if (!order) return { ok: false as const, error: "Order not found." };
    if (order.status !== "payment_pending" && order.status !== "created") return { ok: false as const, error: "This order has already been paid." };

    const payment = await getSetting<PaymentSettings>("payment", { provider: "razorpay", demo_mode: true });
    const { data: txn } = await db.from("transactions").select("*").eq("order_id", order.id).eq("user_id", context.userId).eq("gateway_order_id", data.gatewayOrderId).eq("payment_type", "order").maybeSingle();
    if (!txn) return { ok: false as const, error: "Payment record not found." };
    if (txn.status === "success") return { ok: false as const, error: "This payment has already been processed." };
    if (Number(txn.amount) !== Number(order.total)) return { ok: false as const, error: "Payment amount mismatch." };

    let paymentId = data.gatewayPaymentId ?? `demo_pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    if (!payment.demo_mode) {
      const secret = process.env["RAZORPAY_KEY_SECRET"];
      if (!secret || !data.gatewayPaymentId || !data.signature) return { ok: false as const, error: "Payment verification is not configured yet." };
      const valid = await verifyRazorpaySignature(data.gatewayOrderId, data.gatewayPaymentId, data.signature, secret);
      if (!valid) {
        await db.from("transactions").update({ status: "failed" }).eq("id", txn.id);
        return { ok: false as const, error: "Payment signature verification failed." };
      }
      paymentId = data.gatewayPaymentId;
    }

    const { data: result, error: confirmationError } = await db.rpc("confirm_paid_order", {
      _order_id: order.id,
      _payment_id: paymentId,
      _gateway: payment.demo_mode ? "demo" : "razorpay",
      _gateway_payment_id: paymentId,
      _amount: order.total,
    });
    if (confirmationError || !result?.[0]?.order_number) {
      const message = confirmationError?.message?.toLowerCase().includes("insufficient stock")
        ? "One or more products no longer have enough stock. Please update your cart and try again."
        : "Payment could not be confirmed for this order. No stock was deducted.";
      return { ok: false as const, error: message };
    }

    await db.from("transactions").update({ status: "success", gateway_payment_id: paymentId, gateway_signature: data.signature ?? null }).eq("id", txn.id);
    await notify(context.userId, "Order confirmed", `Your order ${order.order_number} has been placed successfully.`, "order");
    return { ok: true as const, orderNumber: order.order_number, paymentId };
  });
