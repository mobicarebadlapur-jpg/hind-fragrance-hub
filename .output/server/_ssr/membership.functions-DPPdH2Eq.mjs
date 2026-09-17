import { c as createServerRpc, g as getSetting, a as admin, n as notify } from "./platform.server-D-7H_oIi.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
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
async function razorpayOrder(amountInr, receipt) {
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
  if (existing?.status === "pending") return {
    ok: false,
    error: "Your partner application is already pending admin approval."
  };
  let gatewayOrderId = `demo_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  try {
    if (!payment.demo_mode) gatewayOrderId = (await razorpayOrder(membership.price, `membership_${context.userId.slice(0, 8)}_${Date.now()}`)).id;
    const {
      error
    } = await db.from("transactions").insert({
      user_id: context.userId,
      amount: membership.price,
      gateway: payment.demo_mode ? "demo" : "razorpay",
      gateway_order_id: gatewayOrderId,
      status: "created",
      payment_type: "membership"
    });
    if (error) return {
      ok: false,
      error: error.message
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not start payment."
    };
  }
  return {
    ok: true,
    gatewayOrderId,
    amount: membership.price,
    name: membership.name,
    demoMode: payment.demo_mode,
    razorpayKeyId: payment.demo_mode ? null : process.env["RAZORPAY_KEY_ID"] ?? null
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
  if (txn.status === "success") return {
    ok: false,
    error: "This payment has already been processed."
  };
  if (!payment.demo_mode) {
    const secret = process.env["RAZORPAY_KEY_SECRET"];
    if (!secret || !data.gatewayPaymentId || !data.signature) return {
      ok: false,
      error: "Payment verification is not configured yet."
    };
    if (!await verifyRazorpaySignature(data.gatewayOrderId, data.gatewayPaymentId, data.signature, secret)) {
      await db.from("transactions").update({
        status: "failed"
      }).eq("id", txn.id);
      return {
        ok: false,
        error: "Payment signature verification failed."
      };
    }
  }
  const {
    data: existing
  } = await db.from("partners").select("*").eq("user_id", context.userId).maybeSingle();
  if (existing?.status === "active") return {
    ok: false,
    error: "You already have an active partner membership."
  };
  if (existing?.status === "pending") return {
    ok: false,
    error: "Your partner application is already pending admin approval."
  };
  const paymentId = data.gatewayPaymentId ?? `demo_pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
  const randomCode = () => `HF-P-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const randomReferral = () => `HIND-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  let partner = null;
  for (let attempt = 0; attempt < 3 && !partner; attempt++) {
    const {
      data: created,
      error
    } = await db.from("partners").insert({
      user_id: context.userId,
      partner_code: randomCode(),
      referral_code: randomReferral(),
      status: "pending"
    }).select("id,partner_code,referral_code,status").single();
    if (!error) partner = created;
  }
  if (!partner) return {
    ok: false,
    error: "Could not create partner application."
  };
  await db.from("transactions").update({
    status: "success",
    gateway_payment_id: paymentId,
    gateway_signature: data.signature ?? null,
    partner_id: partner.id
  }).eq("id", txn.id);
  await notify(context.userId, "Partner application submitted", `Payment received. Your Partner ID is ${partner.partner_code}. Your application is pending admin approval.`, "membership");
  return {
    ok: true,
    partnerCode: partner.partner_code,
    referralCode: partner.referral_code,
    status: partner.status,
    paymentId
  };
});
export {
  createMembershipOrder_createServerFn_handler,
  verifyMembershipPayment_createServerFn_handler
};
