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

/** Prices, totals and referral attribution are resolved atomically by the database RPC. */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: result, error } = await db.rpc("create_order", {
      _customer_id: context.userId,
      _items: data.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
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

    return { ok: true as const, orderId: order.order_id, orderNumber: order.order_number, total: order.total };
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
