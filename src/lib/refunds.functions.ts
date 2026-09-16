import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, audit, getSetting, isAdmin, notify } from "./platform.server";
import type { PaymentSettings } from "./platform.server";

const refundReason = z.string().trim().min(5).max(500);

async function razorpayRefund(paymentId: string, amountInr: number) {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Math.round(amountInr * 100), speed: "normal" }),
  });
  const payload = (await response.json()) as { id?: string; amount?: number; error?: { description?: string } };
  if (!response.ok || !payload.id) throw new Error(payload.error?.description ?? "Razorpay refund failed.");
  if (payload.amount !== Math.round(amountInr * 100)) throw new Error("Razorpay returned an unexpected refund amount.");
  return payload.id;
}

export const requestOrderCancellationOrRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid(), reason: refundReason }).parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: orderRow } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status").eq("id", data.orderId).eq("customer_id", context.userId).maybeSingle();
    const order = orderRow as any;
    if (!order) return { ok: false as const, error: "Order not found." };
    if (["cancelled", "refunded"].includes(order.status) || ["requested", "approved", "paid"].includes(order.refund_status ?? "")) return { ok: false as const, error: "This order already has a cancellation/refund request." };

    if (["created", "payment_pending"].includes(order.status)) {
      const { error } = await db.from("orders").update({ status: "cancelled", refund_status: null, refund_requested_at: null, refund_requested_amount: null, refund_reason: data.reason } as any).eq("id", order.id).eq("customer_id", context.userId);
      if (error) return { ok: false as const, error: error.message };
      await db.from("transactions").update({ status: "cancelled" }).eq("order_id", order.id).eq("user_id", context.userId).in("status", ["created", "failed"]);
      await notify(context.userId, "Order cancelled", `Your order ${order.order_number} has been cancelled.`, "order");
      return { ok: true as const, mode: "cancelled" as const };
    }

    const { data: txn } = await db.from("transactions").select("id,status,gateway,gateway_payment_id,amount").eq("order_id", order.id).eq("user_id", context.userId).eq("payment_type", "order").eq("status", "success").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!txn?.gateway_payment_id) return { ok: false as const, error: "A successful payment record was not found for this order." };
    const { error } = await db.from("orders").update({ refund_status: "requested", refund_requested_at: new Date().toISOString(), refund_requested_amount: order.total, refund_reason: data.reason } as any).eq("id", order.id).eq("customer_id", context.userId).is("refund_status", null);
    if (error) return { ok: false as const, error: error.message };
    await notify(context.userId, "Refund request received", `Your refund request for ${order.order_number} is under review.`, "refund");
    return { ok: true as const, mode: "refund_requested" as const };
  });

export const listAdminRefundRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden", refunds: [] };
    const db = await admin();
    const { data, error } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status,refund_requested_at,refund_reason,refund_requested_amount,payment_id,shipping_name,mobile,transactions(id,gateway,gateway_payment_id,status,amount,created_at)").eq("refund_status", "requested").order("refund_requested_at", { ascending: false });
    if (error) return { ok: false as const, error: error.message, refunds: [] };
    return { ok: true as const, refunds: data ?? [] };
  });

export const processAdminRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid(), decision: z.enum(["approved", "rejected"]), note: z.string().trim().max(300).optional().nullable() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: orderRow } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status,refund_reason").eq("id", data.orderId).maybeSingle();
    const order = orderRow as any;
    if (!order || order.refund_status !== "requested") return { ok: false as const, error: "Refund request is no longer pending." };

    if (data.decision === "rejected") {
      const reason = data.note ? `${order.refund_reason ?? ""}\nAdmin note: ${data.note}`.trim() : order.refund_reason;
      const { error } = await db.from("orders").update({ refund_status: "rejected", refund_processed_at: new Date().toISOString(), refund_reason: reason } as any).eq("id", order.id).eq("refund_status", "requested");
      if (error) return { ok: false as const, error: error.message };
      await notify(order.customer_id, "Refund request update", `Your refund request for ${order.order_number} was rejected.`, "refund");
      await audit(context.userId, "refund.rejected", order.id, "requested", "rejected");
      return { ok: true as const };
    }

    const { data: txn } = await db.from("transactions").select("id,gateway,gateway_payment_id,status,amount").eq("order_id", order.id).eq("user_id", order.customer_id).eq("payment_type", "order").eq("status", "success").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!txn?.gateway_payment_id) return { ok: false as const, error: "Successful gateway payment not found." };
    if (Number(txn.amount) !== Number(order.total)) return { ok: false as const, error: "Refund amount does not match the original payment." };

    const payment = await getSetting<PaymentSettings>("payment", { provider: "razorpay", demo_mode: true });
    let refundPaymentId = `demo_refund_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    if (!payment.demo_mode && txn.gateway !== "demo") refundPaymentId = await razorpayRefund(txn.gateway_payment_id, Number(order.total));

    const now = new Date().toISOString();
    const { error: orderError } = await db.from("orders").update({ status: "refunded", refund_status: "paid", refund_processed_at: now, refund_payment_id: refundPaymentId } as any).eq("id", order.id).eq("refund_status", "requested");
    if (orderError) return { ok: false as const, error: orderError.message };
    await db.from("transactions").update({ status: "refunded", updated_at: now }).eq("id", txn.id).eq("status", "success");
    await notify(order.customer_id, "Refund processed", `Your refund for order ${order.order_number} has been processed.`, "refund");
    await audit(context.userId, "refund.paid", order.id, "requested", "paid");
    return { ok: true as const, refundPaymentId };
  });
