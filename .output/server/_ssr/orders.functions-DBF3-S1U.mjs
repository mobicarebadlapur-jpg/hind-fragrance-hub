import { c as createServerRpc, a as admin, g as getSetting, n as notify } from "./platform.server-IEPmGFG3.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
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
  })).min(1).max(30),
  referralCode: stringType().trim().max(32).optional().nullable(),
  shippingName: stringType().trim().min(2).max(100),
  mobile: stringType().trim().regex(/^[0-9]{10}$/),
  address: stringType().trim().min(5).max(300),
  city: stringType().trim().min(2).max(80),
  state: stringType().trim().min(2).max(80),
  pincode: stringType().trim().regex(/^[0-9]{6}$/)
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
  const ids = data.items.map((i) => i.productId);
  const {
    data: products
  } = await db.from("products").select("id,name,price,sale_price,stock,status").in("id", ids);
  if (!products || products.length === 0) return {
    ok: false,
    error: "Products are no longer available."
  };
  const lines = data.items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.status !== "active") return [];
    const unit = Number(product.sale_price ?? product.price);
    return [{
      product_id: product.id,
      product_name: product.name,
      unit_price: unit,
      quantity: item.quantity,
      line_total: Number((unit * item.quantity).toFixed(2))
    }];
  });
  if (lines.length === 0) return {
    ok: false,
    error: "None of the items in your cart are available."
  };
  const subtotal = Number(lines.reduce((s, l) => s + l.line_total, 0).toFixed(2));
  const shipping = subtotal >= 999 ? 0 : 59;
  const total = Number((subtotal + shipping).toFixed(2));
  let partnerId = null;
  let referralCode = null;
  if (data.referralCode) {
    const {
      data: partner
    } = await db.from("partners").select("id,user_id,status").eq("referral_code", data.referralCode.toUpperCase()).maybeSingle();
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
    pincode: data.pincode
  });
  const {
    data: order,
    error
  } = await db.from("orders").insert({
    customer_id: context.userId,
    referral_code: referralCode,
    partner_id: partnerId,
    subtotal,
    shipping,
    total,
    status: "payment_pending"
  }).select("*").single();
  if (error || !order) return {
    ok: false,
    error: "Could not create your order."
  };
  await db.from("order_items").insert(lines.map((l) => ({
    ...l,
    order_id: order.id
  })));
  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.order_number,
    total
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
  orderId: stringType().uuid()
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
    demo_mode: false
  });
  if (!payment.demo_mode) {
    return {
      ok: false,
      error: "Payment gateway is not configured yet. Please try again after payment setup is completed."
    };
  }
  const paymentId = `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  const {
    error: transactionError
  } = await db.from("transactions").insert({
    user_id: context.userId,
    partner_id: order.partner_id,
    amount: order.total,
    gateway: "demo",
    gateway_order_id: order.order_number,
    gateway_payment_id: paymentId,
    status: "success",
    payment_type: "product_order"
  });
  if (transactionError) {
    return {
      ok: false,
      error: "Could not record the payment transaction."
    };
  }
  const {
    data: updatedOrder,
    error: updateError
  } = await db.from("orders").update({
    status: "paid",
    payment_id: paymentId
  }).eq("id", order.id).eq("customer_id", context.userId).in("status", ["payment_pending", "created"]).select("id").maybeSingle();
  if (updateError || !updatedOrder) {
    return {
      ok: false,
      error: "Payment could not be confirmed for this order."
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
  payForOrder_createServerFn_handler,
  placeOrder_createServerFn_handler
};
