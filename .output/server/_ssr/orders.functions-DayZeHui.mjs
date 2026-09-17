import { c as createServerRpc, a as admin, g as getSetting, n as notify } from "./platform.server-D-7H_oIi.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
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
const checkoutSchema = objectType({
  items: arrayType(objectType({
    productId: stringType().uuid(),
    quantity: numberType().int().min(1).max(20)
  })).min(1).max(30).superRefine((items, ctx) => {
    const ids = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (ids.has(item.productId)) {
        ctx.addIssue({
          code: "custom",
          path: ["items"],
          message: "Duplicate products are not allowed in checkout."
        });
        break;
      }
      ids.add(item.productId);
    }
  }),
  referralCode: stringType().trim().max(32).optional().nullable(),
  referralVisitorId: stringType().uuid().optional().nullable(),
  shippingName: stringType().trim().min(2).max(100),
  mobile: stringType().trim().regex(/^[0-9]{10}$/),
  address: stringType().trim().min(5).max(300),
  city: stringType().trim().min(2).max(80),
  state: stringType().trim().min(2).max(80),
  pincode: stringType().trim().regex(/^[0-9]{6}$/)
});
async function createRazorpayOrder(amountInr, receipt) {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: Math.round(amountInr * 100),
      currency: "INR",
      receipt,
      payment_capture: 1
    })
  });
  const payload = await response.json();
  if (!response.ok || !payload.id) throw new Error(payload.error?.description ?? "Could not create Razorpay order.");
  if (payload.amount !== Math.round(amountInr * 100) || payload.currency !== "INR") {
    throw new Error("Razorpay returned an unexpected order amount.");
  }
  return payload;
}
async function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${orderId}|${paymentId}`));
  const expected = Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}
const getCustomerOrderDetail_createServerFn_handler = createServerRpc({
  id: "7037d5f06b2e9419a4485e0e134077d4fd26a265feaa086f50b8baaa40ba2457",
  name: "getCustomerOrderDetail",
  filename: "src/lib/orders.functions.ts"
}, (opts) => getCustomerOrderDetail.__executeServer(opts));
const getCustomerOrderDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(getCustomerOrderDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: order,
    error
  } = await db.from("orders").select("*").eq("id", data.orderId).eq("customer_id", context.userId).maybeSingle();
  if (error || !order) return {
    ok: false
  };
  const [{
    data: items
  }, {
    data: transactions
  }] = await Promise.all([db.from("order_items").select("*").eq("order_id", order.id).order("created_at", {
    ascending: true
  }), db.from("transactions").select("id,order_id,amount,currency,gateway,payment_type,gateway_order_id,gateway_payment_id,status,created_at,updated_at").eq("order_id", order.id).eq("user_id", context.userId).order("created_at", {
    ascending: true
  })]);
  return {
    ok: true,
    order,
    items: items ?? [],
    transactions: transactions ?? []
  };
});
const placeOrder_createServerFn_handler = createServerRpc({
  id: "a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a",
  name: "placeOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
const placeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => checkoutSchema.parse(input)).handler(placeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: result,
    error
  } = await db.rpc("create_order", {
    _customer_id: context.userId,
    _items: data.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity
    })),
    _referral_code: data.referralCode ?? null,
    _referral_visitor_id: data.referralVisitorId ?? null,
    _shipping_name: data.shippingName,
    _mobile: data.mobile,
    _address: data.address,
    _city: data.city,
    _state: data.state,
    _pincode: data.pincode
  });
  const order = result?.[0];
  if (error || !order) {
    const message = error?.message?.toLowerCase().includes("no longer available") ? "One or more products are no longer available." : "Could not create your order.";
    return {
      ok: false,
      error: message
    };
  }
  const payment = await getSetting("payment", {
    provider: "razorpay",
    demo_mode: true
  });
  const receipt = `order_${order.order_number}`;
  let gatewayOrderId = `demo_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  let gateway = "demo";
  try {
    if (!payment.demo_mode) {
      const gatewayOrder = await createRazorpayOrder(order.total, receipt);
      gatewayOrderId = gatewayOrder.id;
      gateway = "razorpay";
    }
    const {
      error: txError
    } = await db.from("transactions").insert({
      user_id: context.userId,
      order_id: order.order_id,
      amount: order.total,
      currency: "INR",
      gateway,
      payment_type: "order",
      gateway_order_id: gatewayOrderId,
      status: "created"
    });
    if (txError) throw new Error(txError.message);
  } catch (error2) {
    await db.rpc("delete_unpaid_order", {
      _order_id: order.order_id
    });
    return {
      ok: false,
      error: error2 instanceof Error ? error2.message : "Could not start payment."
    };
  }
  return {
    ok: true,
    orderId: order.order_id,
    orderNumber: order.order_number,
    total: order.total,
    demoMode: payment.demo_mode,
    gatewayOrderId,
    razorpayKeyId: payment.demo_mode ? null : process.env["RAZORPAY_KEY_ID"] ?? null
  };
});
const payForOrder_createServerFn_handler = createServerRpc({
  id: "368d0f429b57d16396378ed4fe033f1b91e7e9533b1aeaeb80f9f8ac75dcc904",
  name: "payForOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => payForOrder.__executeServer(opts));
const payForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  gatewayOrderId: stringType().min(6),
  gatewayPaymentId: stringType().min(6).optional(),
  signature: stringType().min(10).optional()
}).parse(input)).handler(payForOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: order
  } = await db.from("orders").select("*").eq("id", data.orderId).eq("customer_id", context.userId).maybeSingle();
  if (!order) return {
    ok: false,
    error: "Order not found."
  };
  if (order.status !== "payment_pending" && order.status !== "created") return {
    ok: false,
    error: "This order has already been paid."
  };
  const payment = await getSetting("payment", {
    provider: "razorpay",
    demo_mode: true
  });
  const {
    data: txn
  } = await db.from("transactions").select("*").eq("order_id", order.id).eq("user_id", context.userId).eq("gateway_order_id", data.gatewayOrderId).eq("payment_type", "order").maybeSingle();
  if (!txn) return {
    ok: false,
    error: "Payment record not found."
  };
  if (txn.status === "success") return {
    ok: false,
    error: "This payment has already been processed."
  };
  if (txn.status !== "created") return {
    ok: false,
    error: "This payment is not pending."
  };
  if (Number(txn.amount) !== Number(order.total)) return {
    ok: false,
    error: "Payment amount mismatch."
  };
  let paymentId = data.gatewayPaymentId ?? `demo_pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  if (!payment.demo_mode) {
    const secret = process.env["RAZORPAY_KEY_SECRET"];
    if (!secret || !data.gatewayPaymentId || !data.signature) return {
      ok: false,
      error: "Payment verification is not configured yet."
    };
    const valid = await verifyRazorpaySignature(data.gatewayOrderId, data.gatewayPaymentId, data.signature, secret);
    if (!valid) {
      await db.from("transactions").update({
        status: "failed"
      }).eq("id", txn.id).eq("status", "created");
      return {
        ok: false,
        error: "Payment signature verification failed."
      };
    }
    paymentId = data.gatewayPaymentId;
  }
  const {
    data: result,
    error: confirmationError
  } = await db.rpc("confirm_paid_order", {
    _order_id: order.id,
    _gateway_order_id: data.gatewayOrderId,
    _payment_id: paymentId,
    _gateway: payment.demo_mode ? "demo" : "razorpay",
    _gateway_payment_id: paymentId,
    _amount: order.total,
    _gateway_signature: data.signature ?? null
  });
  if (confirmationError || !result?.[0]?.order_number) {
    const message = confirmationError?.message?.toLowerCase().includes("insufficient stock") ? "One or more products no longer have enough stock. Please update your cart and try again." : "Payment could not be confirmed for this order. No stock was deducted.";
    return {
      ok: false,
      error: message
    };
  }
  await notify(context.userId, "Order confirmed", `Your order ${order.order_number} has been placed successfully.`, "order");
  return {
    ok: true,
    orderNumber: order.order_number,
    paymentId
  };
});
export {
  getCustomerOrderDetail_createServerFn_handler,
  payForOrder_createServerFn_handler,
  placeOrder_createServerFn_handler
};
