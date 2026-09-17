import { c as createServerRpc, i as isAdmin, a as admin, n as notify, b as audit } from "./platform.server-D-7H_oIi.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const payoutStatus = enumType(["requested", "under_review", "approved", "processing", "paid", "rejected"]);
const listAdminPayouts_createServerFn_handler = createServerRpc({
  id: "36318e3d34331c6d023e650a11994835c333f34cb680f3f603c07658a671ce78",
  name: "listAdminPayouts",
  filename: "src/lib/admin-payouts.functions.ts"
}, (opts) => listAdminPayouts.__executeServer(opts));
const listAdminPayouts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminPayouts_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden",
    payouts: []
  };
  const db = await admin();
  const {
    data,
    error
  } = await db.from("payouts").select("id,partner_id,amount,method,account_holder,bank_name,status,notes,requested_at,processed_at,created_at,updated_at,account_number_last4,upi_id_masked,ifsc_masked,partners(partner_code,user_id)").order("created_at", {
    ascending: false
  });
  if (error) return {
    ok: false,
    error: error.message,
    payouts: []
  };
  return {
    ok: true,
    payouts: data ?? []
  };
});
const updateAdminPayout_createServerFn_handler = createServerRpc({
  id: "45d5c35069e008d6497afe240e19889a0f0f977c34b40a748ee36bbf9a592d6a",
  name: "updateAdminPayout",
  filename: "src/lib/admin-payouts.functions.ts"
}, (opts) => updateAdminPayout.__executeServer(opts));
const updateAdminPayout = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  payoutId: stringType().uuid(),
  status: payoutStatus,
  notes: stringType().trim().max(300).nullable().optional()
}).parse(input)).handler(updateAdminPayout_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: payout
  } = await db.from("payouts").select("id,partner_id,amount,status,partners(user_id)").eq("id", data.payoutId).maybeSingle();
  if (!payout) return {
    ok: false,
    error: "Payout not found."
  };
  if (payout.status === "paid" && data.status !== "paid") return {
    ok: false,
    error: "Paid payouts cannot be moved backwards."
  };
  if (data.status === "paid") {
    const {
      error
    } = await db.rpc("set_payout_paid_atomically", {
      _payout_id: data.payoutId
    });
    if (error) return {
      ok: false,
      error: error.message
    };
  } else {
    const patch = {
      status: data.status,
      notes: data.notes ?? null
    };
    if (["processing"].includes(data.status)) patch.processed_at = (/* @__PURE__ */ new Date()).toISOString();
    const {
      error
    } = await db.from("payouts").update(patch).eq("id", data.payoutId);
    if (error) return {
      ok: false,
      error: error.message
    };
  }
  if (data.notes !== void 0 && data.status === "paid") {
    const {
      error
    } = await db.from("payouts").update({
      notes: data.notes ?? null
    }).eq("id", data.payoutId).eq("status", "paid");
    if (error) return {
      ok: false,
      error: error.message
    };
  }
  const partnerUser = payout.partners?.user_id;
  if (partnerUser) await notify(partnerUser, "Payout update", `Your payout of ₹${Number(payout.amount).toFixed(2)} is now ${data.status.replace("_", " ")}.`, "payout");
  await audit(context.userId, "payout.status", data.payoutId, payout.status, data.status);
  return {
    ok: true
  };
});
export {
  listAdminPayouts_createServerFn_handler,
  updateAdminPayout_createServerFn_handler
};
