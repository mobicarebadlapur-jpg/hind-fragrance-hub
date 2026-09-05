import { c as createServerRpc, a as admin, s as sha256, g as getSetting } from "./platform.server-tvadrG6h.mjs";
import { c as createServerFn } from "./server-dt98x2q-.mjs";
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
const mobileSchema = objectType({
  mobile: stringType().trim().regex(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number")
});
const sendOtp_createServerFn_handler = createServerRpc({
  id: "d3b911c10f37cf5763c36d5f8e080ea42c2592fdc270da223651f7f8c2732fbf",
  name: "sendOtp",
  filename: "src/lib/otp.functions.ts"
}, (opts) => sendOtp.__executeServer(opts));
const sendOtp = createServerFn({
  method: "POST"
}).inputValidator((input) => mobileSchema.parse(input)).handler(sendOtp_createServerFn_handler, async ({
  data
}) => {
  const db = await admin();
  const since = new Date(Date.now() - 10 * 6e4).toISOString();
  const {
    count
  } = await db.from("otp_verifications").select("id", {
    count: "exact",
    head: true
  }).eq("mobile", data.mobile).gte("created_at", since);
  if ((count ?? 0) >= 5) {
    return {
      ok: false,
      error: "Too many OTP requests. Please try again in 10 minutes."
    };
  }
  const code = String(Math.floor(1e5 + Math.random() * 9e5));
  await db.from("otp_verifications").insert({
    mobile: data.mobile,
    code_hash: await sha256(code),
    expires_at: new Date(Date.now() + 5 * 6e4).toISOString()
  });
  const payment = await getSetting("payment", {
    provider: "razorpay",
    demo_mode: true
  });
  return {
    ok: true,
    demo: payment.demo_mode,
    demoCode: payment.demo_mode ? code : null,
    expiresInSeconds: 300
  };
});
const verifyOtp_createServerFn_handler = createServerRpc({
  id: "a41441e847287c5ee4b65776a9ee9358c2a43c751710cdf47f6ce3ae4ab5e579",
  name: "verifyOtp",
  filename: "src/lib/otp.functions.ts"
}, (opts) => verifyOtp.__executeServer(opts));
const verifyOtp = createServerFn({
  method: "POST"
}).inputValidator((input) => mobileSchema.extend({
  code: stringType().trim().length(6)
}).parse(input)).handler(verifyOtp_createServerFn_handler, async ({
  data
}) => {
  const db = await admin();
  const {
    data: record
  } = await db.from("otp_verifications").select("*").eq("mobile", data.mobile).eq("used", false).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!record) return {
    ok: false,
    error: "No OTP found. Please request a new code."
  };
  if (new Date(record.expires_at).getTime() < Date.now()) return {
    ok: false,
    error: "This OTP has expired. Request a new one."
  };
  if (record.attempts >= 5) return {
    ok: false,
    error: "Too many incorrect attempts. Request a new OTP."
  };
  if (record.code_hash !== await sha256(data.code)) {
    await db.from("otp_verifications").update({
      attempts: record.attempts + 1
    }).eq("id", record.id);
    return {
      ok: false,
      error: "Incorrect OTP. Please check and try again."
    };
  }
  await db.from("otp_verifications").update({
    used: true
  }).eq("id", record.id);
  return {
    ok: true
  };
});
export {
  sendOtp_createServerFn_handler,
  verifyOtp_createServerFn_handler
};
