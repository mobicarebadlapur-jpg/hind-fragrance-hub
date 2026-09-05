import { c as createServerRpc, a as admin, g as getSetting, d as availableBalance, n as notify } from "./platform.server-tvadrG6h.mjs";
import { c as createServerFn } from "./server-dt98x2q-.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BYHyo-go.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
const payoutSchema = objectType({
  amount: numberType().positive().max(1e6),
  method: enumType(["bank", "upi"]),
  accountHolder: stringType().trim().max(100).optional(),
  bankName: stringType().trim().max(100).optional(),
  accountNumber: stringType().trim().max(30).optional(),
  ifsc: stringType().trim().max(20).optional(),
  upiId: stringType().trim().max(60).optional()
});
const getPartnerBalance_createServerFn_handler = createServerRpc({
  id: "44b55c12a99f027b52a99e0c7d22bb9e90405f6e55d91cb56c40afce0edd8db9",
  name: "getPartnerBalance",
  filename: "src/lib/payouts.functions.ts"
}, (opts) => getPartnerBalance.__executeServer(opts));
const getPartnerBalance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getPartnerBalance_createServerFn_handler, async ({
  context
}) => {
  const db = await admin();
  const {
    data: partner
  } = await db.from("partners").select("id").eq("user_id", context.userId).maybeSingle();
  if (!partner) return {
    available: 0,
    minPayout: 0
  };
  const settings = await getSetting("commission", {
    default_percent: 10,
    min_payout: 500,
    holding_days: 7,
    allow_product_specific: true,
    allow_category_specific: true,
    basis: "product_subtotal",
    exclude_shipping: true,
    exclude_tax: true,
    exclude_discounts: true
  });
  return {
    available: await availableBalance(partner.id),
    minPayout: Number(settings.min_payout)
  };
});
const requestPayout_createServerFn_handler = createServerRpc({
  id: "e8d18f8d1d96cbdfb3bef5ec00e6ae7d3e21760252dd97c94b5f26794a5df23f",
  name: "requestPayout",
  filename: "src/lib/payouts.functions.ts"
}, (opts) => requestPayout.__executeServer(opts));
const requestPayout = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => payoutSchema.parse(input)).handler(requestPayout_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: partner
  } = await db.from("partners").select("id,status").eq("user_id", context.userId).maybeSingle();
  if (!partner || partner.status !== "active") return {
    ok: false,
    error: "Only active business partners can request a payout."
  };
  const settings = await getSetting("commission", {
    default_percent: 10,
    min_payout: 500,
    holding_days: 7,
    allow_product_specific: true,
    allow_category_specific: true,
    basis: "product_subtotal",
    exclude_shipping: true,
    exclude_tax: true,
    exclude_discounts: true
  });
  const available = await availableBalance(partner.id);
  if (data.amount < Number(settings.min_payout)) return {
    ok: false,
    error: `Minimum payout amount is ₹${settings.min_payout}.`
  };
  if (data.amount > available) return {
    ok: false,
    error: `Insufficient balance. You currently have ₹${available.toFixed(2)} available.`
  };
  if (data.method === "bank" && (!data.accountNumber || !data.ifsc || !data.accountHolder)) return {
    ok: false,
    error: "Please provide complete bank details."
  };
  if (data.method === "upi" && !data.upiId) return {
    ok: false,
    error: "Please provide a valid UPI ID."
  };
  const {
    error
  } = await db.from("payouts").insert({
    partner_id: partner.id,
    amount: data.amount,
    method: data.method,
    account_holder: data.accountHolder ?? null,
    bank_name: data.bankName ?? null,
    account_number: data.accountNumber ?? null,
    ifsc: data.ifsc ?? null,
    upi_id: data.upiId ?? null,
    status: "requested"
  });
  if (error) return {
    ok: false,
    error: error.message
  };
  await notify(context.userId, "Payout requested", `Your payout request of ₹${data.amount.toFixed(2)} is under review.`, "payout");
  return {
    ok: true
  };
});
export {
  getPartnerBalance_createServerFn_handler,
  requestPayout_createServerFn_handler
};
