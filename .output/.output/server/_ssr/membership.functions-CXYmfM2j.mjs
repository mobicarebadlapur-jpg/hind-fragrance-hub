import { c as createServerRpc, g as getSetting, a as admin, n as notify } from "./platform.server-IEPmGFG3.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const createMembershipOrder_createServerFn_handler = createServerRpc({
  id: "d25930c2709306e3e634dc6619e8b26d3a71ba47c939c3ee7e587f3338ae35ed",
  name: "createMembershipOrder",
  filename: "src/lib/membership.functions.ts"
}, (opts) => createMembershipOrder.__executeServer(opts));
const createMembershipOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createMembershipOrder_createServerFn_handler, async ({
  context
}) => {
  const membership = await getSetting("membership", {
    price: 199,
    name: "Business Partner Membership",
    active: true
  });
  if (!membership.active) return {
    ok: false,
    error: "Membership registration is currently closed."
  };
  const payment = await getSetting("payment", {
    provider: "razorpay",
    demo_mode: true
  });
  const db = await admin();
  const {
    data: existing
  } = await db.from("partners").select("status").eq("user_id", context.userId).maybeSingle();
  if (existing?.status === "active") return {
    ok: false,
    error: "You already have an active partner membership."
  };
  const gatewayOrderId = `${payment.demo_mode ? "demo" : "order"}_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  await db.from("transactions").insert({
    user_id: context.userId,
    amount: membership.price,
    gateway: payment.demo_mode ? "demo" : payment.provider,
    gateway_order_id: gatewayOrderId,
    status: "created",
    payment_type: "membership"
  });
  return {
    ok: true,
    gatewayOrderId,
    amount: membership.price,
    name: membership.name,
    demoMode: payment.demo_mode,
    // Production: return the Razorpay order id + key_id here for Checkout.
    razorpayKeyId: process.env["RAZORPAY_KEY_ID"] ?? null
  };
});
const verifyMembershipPayment_createServerFn_handler = createServerRpc({
  id: "b7366b80948f3bf2209a8c76486a7800537c2af2480abeb6b6eaf35e10c34d8e",
  name: "verifyMembershipPayment",
  filename: "src/lib/membership.functions.ts"
}, (opts) => verifyMembershipPayment.__executeServer(opts));
const verifyMembershipPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  gatewayOrderId: stringType().min(6),
  gatewayPaymentId: stringType().optional(),
  signature: stringType().optional()
}).parse(input)).handler(verifyMembershipPayment_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const payment = await getSetting("payment", {
    provider: "razorpay",
    demo_mode: true
  });
  const {
    data: txn
  } = await db.from("transactions").select("*").eq("gateway_order_id", data.gatewayOrderId).eq("user_id", context.userId).maybeSingle();
  if (!txn) return {
    ok: false,
    error: "Payment record not found."
  };
  if (txn.status === "success" && txn.partner_id) return {
    ok: false,
    error: "This payment has already been processed."
  };
  if (!payment.demo_mode) {
    const secret = process.env["RAZORPAY_KEY_SECRET"];
    if (!secret || !data.signature) return {
      ok: false,
      error: "Payment verification is not configured yet."
    };
  }
  const paymentId = data.gatewayPaymentId ?? `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  const {
    data: existing
  } = await db.from("partners").select("*").eq("user_id", context.userId).maybeSingle();
  let partner = existing;
  if (!partner) {
    const {
      data: code
    } = await db.rpc("next_partner_code");
    const partnerCode = code ?? `HFBP${Date.now()}`;
    const {
      data: created,
      error
    } = await db.from("partners").insert({
      user_id: context.userId,
      partner_code: partnerCode,
      referral_code: partnerCode,
      status: "active",
      membership_price: Number(txn.amount),
      membership_date: (/* @__PURE__ */ new Date()).toISOString(),
      payment_id: paymentId
    }).select("*").single();
    if (error) return {
      ok: false,
      error: "Could not activate membership."
    };
    partner = created;
  } else {
    const {
      data: updated
    } = await db.from("partners").update({
      status: "active",
      membership_price: Number(txn.amount),
      membership_date: (/* @__PURE__ */ new Date()).toISOString(),
      payment_id: paymentId
    }).eq("id", partner.id).select("*").single();
    partner = updated ?? partner;
  }
  await db.from("transactions").update({
    status: "success",
    gateway_payment_id: paymentId,
    partner_id: partner.id
  }).eq("id", txn.id);
  await db.from("user_roles").upsert({
    user_id: context.userId,
    role: "partner"
  }, {
    onConflict: "user_id,role"
  });
  await notify(context.userId, "Partner membership activated", `Welcome aboard! Your Partner ID is ${partner.partner_code}.`, "membership");
  return {
    ok: true,
    partnerCode: partner.partner_code,
    referralCode: partner.referral_code,
    paymentId
  };
});
export {
  createMembershipOrder_createServerFn_handler,
  verifyMembershipPayment_createServerFn_handler
};
