import { c as createServerRpc, a as admin, n as notify, i as isAdmin, b as audit, g as getSetting } from "./platform.server-D-7H_oIi.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as stringType, o as objectType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const refundReason = stringType().trim().min(5).max(500);
async function razorpayRefund(paymentId, amountInr) {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: Math.round(amountInr * 100),
      speed: "normal"
    })
  });
  const payload = await response.json();
  if (!response.ok || !payload.id) throw new Error(payload.error?.description ?? "Razorpay refund failed.");
  if (payload.amount !== Math.round(amountInr * 100)) throw new Error("Razorpay returned an unexpected refund amount.");
  return payload.id;
}
const requestOrderCancellationOrRefund_createServerFn_handler = createServerRpc({
  id: "16474e78f6807b083f980469f884214f2fe6c8a404103fa0902f7caa6861e470",
  name: "requestOrderCancellationOrRefund",
  filename: "src/lib/refunds.functions.ts"
}, (opts) => requestOrderCancellationOrRefund.__executeServer(opts));
const requestOrderCancellationOrRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  reason: refundReason
}).parse(input)).handler(requestOrderCancellationOrRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: orderRow
  } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status").eq("id", data.orderId).eq("customer_id", context.userId).maybeSingle();
  const order = orderRow;
  if (!order) return {
    ok: false,
    error: "Order not found."
  };
  if (["cancelled", "refunded"].includes(order.status) || ["requested", "approved", "paid"].includes(order.refund_status ?? "")) return {
    ok: false,
    error: "This order already has a cancellation/refund request."
  };
  if (["created", "payment_pending"].includes(order.status)) {
    const {
      error: error2
    } = await db.from("orders").update({
      status: "cancelled",
      refund_status: null,
      refund_requested_at: null,
      refund_requested_amount: null,
      refund_reason: data.reason
    }).eq("id", order.id).eq("customer_id", context.userId);
    if (error2) return {
      ok: false,
      error: error2.message
    };
    await db.from("commissions").update({
      status: "cancelled"
    }).eq("order_id", order.id).in("status", ["pending", "available"]);
    await db.from("transactions").update({
      status: "cancelled"
    }).eq("order_id", order.id).eq("user_id", context.userId).in("status", ["created", "failed"]);
    await notify(context.userId, "Order cancelled", `Your order ${order.order_number} has been cancelled.`, "order");
    return {
      ok: true,
      mode: "cancelled"
    };
  }
  const {
    data: txn
  } = await db.from("transactions").select("id,status,gateway,gateway_payment_id,amount").eq("order_id", order.id).eq("user_id", context.userId).eq("payment_type", "order").eq("status", "success").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!txn?.gateway_payment_id) return {
    ok: false,
    error: "A successful payment record was not found for this order."
  };
  const {
    error
  } = await db.from("orders").update({
    refund_status: "requested",
    refund_requested_at: (/* @__PURE__ */ new Date()).toISOString(),
    refund_requested_amount: order.total,
    refund_reason: data.reason
  }).eq("id", order.id).eq("customer_id", context.userId).is("refund_status", null);
  if (error) return {
    ok: false,
    error: error.message
  };
  await notify(context.userId, "Refund request received", `Your refund request for ${order.order_number} is under review.`, "refund");
  return {
    ok: true,
    mode: "refund_requested"
  };
});
const listAdminRefundRequests_createServerFn_handler = createServerRpc({
  id: "c0b70df35af73b70ce7d75495b27e5e0e2836e33e902697535a3ed7df3835418",
  name: "listAdminRefundRequests",
  filename: "src/lib/refunds.functions.ts"
}, (opts) => listAdminRefundRequests.__executeServer(opts));
const listAdminRefundRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminRefundRequests_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden",
    refunds: []
  };
  const db = await admin();
  const {
    data,
    error
  } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status,refund_requested_at,refund_reason,refund_requested_amount,refund_payment_id,payment_id,shipping_name,mobile,transactions(id,gateway,gateway_payment_id,status,amount,created_at)").in("refund_status", ["requested", "approved"]).order("refund_requested_at", {
    ascending: false
  });
  if (error) return {
    ok: false,
    error: error.message,
    refunds: []
  };
  return {
    ok: true,
    refunds: data ?? []
  };
});
const processAdminRefund_createServerFn_handler = createServerRpc({
  id: "a458bf7ad354cb6de1aa4cd733b574332bb8a41c54f6c9a1d36a6ff9bace03ec",
  name: "processAdminRefund",
  filename: "src/lib/refunds.functions.ts"
}, (opts) => processAdminRefund.__executeServer(opts));
const processAdminRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  decision: enumType(["approved", "rejected"]),
  note: stringType().trim().max(300).optional().nullable()
}).parse(input)).handler(processAdminRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: initialRow
  } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status,refund_reason,refund_payment_id").eq("id", data.orderId).maybeSingle();
  const initial = initialRow;
  if (!initial || !["requested", "approved"].includes(initial.refund_status ?? "")) return {
    ok: false,
    error: "Refund request is no longer pending."
  };
  if (data.decision === "rejected") {
    if (initial.refund_status !== "requested") return {
      ok: false,
      error: "An approved refund cannot be rejected."
    };
    const reason = data.note ? `${initial.refund_reason ?? ""}
Admin note: ${data.note}`.trim() : initial.refund_reason;
    const {
      error
    } = await db.from("orders").update({
      refund_status: "rejected",
      refund_processed_at: (/* @__PURE__ */ new Date()).toISOString(),
      refund_reason: reason
    }).eq("id", initial.id).eq("refund_status", "requested");
    if (error) return {
      ok: false,
      error: error.message
    };
    await notify(initial.customer_id, "Refund request update", `Your refund request for ${initial.order_number} was rejected.`, "refund");
    await audit(context.userId, "refund.rejected", initial.id, "requested", "rejected");
    return {
      ok: true
    };
  }
  if (initial.refund_status === "requested") {
    const {
      data: claimed
    } = await db.from("orders").update({
      refund_status: "approved"
    }).eq("id", initial.id).eq("refund_status", "requested").select("id").maybeSingle();
    if (!claimed) return {
      ok: false,
      error: "Another admin is already processing this refund. Refresh the queue and try again."
    };
  }
  const {
    data: orderRow
  } = await db.from("orders").select("id,order_number,customer_id,total,status,refund_status,refund_reason,refund_payment_id").eq("id", initial.id).maybeSingle();
  const order = orderRow;
  if (!order || order.refund_status !== "approved") return {
    ok: false,
    error: "Refund processing state could not be confirmed."
  };
  let refundPaymentId = order.refund_payment_id;
  if (!refundPaymentId) {
    const {
      data: txn
    } = await db.from("transactions").select("id,gateway,gateway_payment_id,status,amount").eq("order_id", order.id).eq("user_id", order.customer_id).eq("payment_type", "order").eq("status", "success").order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    if (!txn?.gateway_payment_id) {
      await db.from("orders").update({
        refund_status: "requested"
      }).eq("id", order.id).eq("refund_status", "approved");
      return {
        ok: false,
        error: "Successful gateway payment not found."
      };
    }
    if (Number(txn.amount) !== Number(order.total)) {
      await db.from("orders").update({
        refund_status: "requested"
      }).eq("id", order.id).eq("refund_status", "approved");
      return {
        ok: false,
        error: "Refund amount does not match the original payment."
      };
    }
    try {
      const payment = await getSetting("payment", {
        provider: "razorpay",
        demo_mode: true
      });
      refundPaymentId = `demo_refund_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
      if (!payment.demo_mode && txn.gateway !== "demo") refundPaymentId = await razorpayRefund(txn.gateway_payment_id, Number(order.total));
    } catch (error) {
      await db.from("orders").update({
        refund_status: "requested"
      }).eq("id", order.id).eq("refund_status", "approved");
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Refund gateway request failed."
      };
    }
    const {
      error: storeRefundIdError
    } = await db.from("orders").update({
      refund_payment_id: refundPaymentId
    }).eq("id", order.id).eq("refund_status", "approved").is("refund_payment_id", null);
    if (storeRefundIdError) return {
      ok: false,
      error: "Refund was created but its reference could not be saved. Keep this request in approved state and retry after checking the gateway."
    };
  }
  const {
    data: finalized,
    error: finalizeError
  } = await db.rpc("finalize_order_refund", {
    _order_id: order.id,
    _refund_payment_id: refundPaymentId
  });
  if (finalizeError || !finalized?.[0]?.order_number) return {
    ok: false,
    error: finalizeError?.message ?? "Refund was created but order reconciliation could not be completed."
  };
  await db.from("transactions").update({
    status: "refunded",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("order_id", order.id).eq("user_id", order.customer_id).eq("payment_type", "order").eq("status", "success");
  await notify(order.customer_id, "Refund processed", `Your refund for order ${order.order_number} has been processed.`, "refund");
  await audit(context.userId, "refund.paid", order.id, "approved", "paid");
  return {
    ok: true,
    refundPaymentId
  };
});
export {
  listAdminRefundRequests_createServerFn_handler,
  processAdminRefund_createServerFn_handler,
  requestOrderCancellationOrRefund_createServerFn_handler
};
