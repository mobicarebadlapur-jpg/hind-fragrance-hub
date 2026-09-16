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
          ctx.addIssue({
            code: "custom",
            path: ["items"],
            message: "Duplicate products are not allowed in checkout.",
          });
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

/** Prices, totals and referral attribution are resolved server-side. */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const ids = data.items.map((i) => i.productId);
    const { data: products } = await db
      .from("products")
      .select("id,name,price,sale_price,stock,status")
      .in("id", ids);

    // Never silently drop cart lines. A client must not be able to turn an
    // unavailable/missing product into a smaller, valid order.
    if (!products || products.length !== ids.length) {
      return { ok: false as const, error: "One or more products are no longer available." };
    }

    const lines = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.status !== "active") return null;
      const unit = Number(product.sale_price ?? product.price);
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: unit,
        quantity: item.quantity,
        line_total: Number((unit * item.quantity).toFixed(2)),
      };
    });

    if (lines.some((line) => line === null)) {
      return { ok: false as const, error: "One or more products are no longer available." };
    }

    const safeLines = lines as Array<{
      product_id: string;
      product_name: string;
      unit_price: number;
      quantity: number;
      line_total: number;
    }>;

    const subtotal = Number(safeLines.reduce((s, l) => s + l.line_total, 0).toFixed(2));
    const shipping = subtotal >= 999 ? 0 : 59;
    const total = Number((subtotal + shipping).toFixed(2));

    let partnerId: string | null = null;
    let referralCode: string | null = null;
    if (data.referralCode) {
      const { data: partner } = await db
        .from("partners")
        .select("id,user_id,status")
        .eq("referral_code", data.referralCode.toUpperCase())
        .maybeSingle();
      if (partner && partner.status === "active" && partner.user_id !== context.userId) {
        partnerId = partner.id;
        referralCode = data.referralCode.toUpperCase();
      }
    }

    await db.from("profiles").upsert({
      id: context.userId,
      full_name: data.shippingName,
      mobile: data.mobile,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });

    const { data: order, error } = await db
      .from("orders")
      .insert({
        customer_id: context.userId,
        referral_code: referralCode,
        referral_visitor_id: data.referralVisitorId ?? null,
        partner_id: partnerId,
        subtotal,
        shipping,
        total,
        status: "payment_pending",
      })
      .select("*")
      .single();
    if (error || !order) return { ok: false as const, error: "Could not create your order." };

    const { error: itemsError } = await db
      .from("order_items")
      .insert(safeLines.map((l) => ({ ...l, order_id: order.id })));
    if (itemsError) {
      await db.from("orders").delete().eq("id", order.id);
      return { ok: false as const, error: "Could not save the items in your order." };
    }

    return { ok: true as const, orderId: order.id, orderNumber: order.order_number, total };
  });

/** Confirms payment for an order; demo mode simulates a successful gateway. */
export const payForOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: order } = await db
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .eq("customer_id", context.userId)
      .maybeSingle();
    if (!order) return { ok: false as const, error: "Order not found." };
    if (order.status !== "payment_pending" && order.status !== "created")
      return { ok: false as const, error: "This order has already been paid." };

    const payment = await getSetting<PaymentSettings>("payment", {
      provider: "razorpay",
      demo_mode: false,
    });
    if (!payment.demo_mode) {
      return {
        ok: false as const,
        error: "Payment gateway is not configured yet. Please try again after payment setup is completed.",
      };
    }

    const paymentId = `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    const { data: result, error: confirmationError } = await db.rpc("confirm_paid_order", {
      _order_id: order.id,
      _payment_id: paymentId,
      _gateway: "demo",
      _gateway_payment_id: paymentId,
      _amount: order.total,
    });
    if (confirmationError || !result?.[0]?.order_number) {
      const message = confirmationError?.message?.toLowerCase().includes("insufficient stock")
        ? "One or more products no longer have enough stock. Please update your cart and try again."
        : "Payment could not be confirmed for this order. No stock was deducted.";
      return { ok: false as const, error: message };
    }

    await notify(
      context.userId,
      "Order confirmed",
      `Your order ${order.order_number} has been placed successfully.`,
      "order",
    );
    return { ok: true as const, orderNumber: order.order_number, paymentId };
  });
