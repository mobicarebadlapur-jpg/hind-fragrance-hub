import { c as createServerRpc, i as isAdmin, a as admin, b as audit, n as notify } from "./platform.server-IEPmGFG3.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, r as recordType, u as unknownType, s as stringType, e as enumType, n as numberType, b as booleanType } from "../_libs/zod.mjs";
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
const updateSetting_createServerFn_handler = createServerRpc({
  id: "742f70fd777ae551ad3e3d3d2db22cdd962f265a6451e0c71a29e8525bb6c8b6",
  name: "updateSetting",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateSetting.__executeServer(opts));
const updateSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  key: stringType().min(2).max(40),
  value: recordType(unknownType())
}).parse(input)).handler(updateSetting_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: previous
  } = await db.from("app_settings").select("value").eq("key", data.key).maybeSingle();
  await db.from("app_settings").upsert({
    key: data.key,
    value: data.value,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  await audit(context.userId, "settings.update", data.key, previous?.value ?? null, data.value);
  return {
    ok: true
  };
});
const updatePartnerStatus_createServerFn_handler = createServerRpc({
  id: "bb217f220b6ee2e07fd572ac6c94b91d49f4222202511ecfdf722c60f9f152ad",
  name: "updatePartnerStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updatePartnerStatus.__executeServer(opts));
const updatePartnerStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  partnerId: stringType().uuid(),
  status: enumType(["pending", "payment_pending", "active", "suspended", "cancelled"])
}).parse(input)).handler(updatePartnerStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: previous
  } = await db.from("partners").select("status,user_id,partner_code").eq("id", data.partnerId).maybeSingle();
  await db.from("partners").update({
    status: data.status
  }).eq("id", data.partnerId);
  await audit(context.userId, "partner.status", previous?.partner_code ?? data.partnerId, previous?.status ?? null, data.status);
  if (previous?.user_id) await notify(previous.user_id, "Partner account updated", `Your partner account status is now ${data.status.replace("_", " ")}.`, "partner");
  return {
    ok: true
  };
});
const updateOrderStatus_createServerFn_handler = createServerRpc({
  id: "573e69518e877f2ce18e3820832cb2cb45d1a897de1933c05de86f50fa9a7e10",
  name: "updateOrderStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
const updateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  status: enumType(["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "returned"])
}).parse(input)).handler(updateOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: previous
  } = await db.from("orders").select("status,order_number").eq("id", data.orderId).maybeSingle();
  await db.from("orders").update({
    status: data.status
  }).eq("id", data.orderId);
  if (data.status === "delivered") await db.from("commissions").update({
    status: "approved"
  }).eq("order_id", data.orderId).eq("status", "pending");
  await audit(context.userId, "order.status", previous?.order_number ?? data.orderId, previous?.status ?? null, data.status);
  return {
    ok: true
  };
});
const updateCommissionStatus_createServerFn_handler = createServerRpc({
  id: "1e39cb8e06d355ded8768a07115b74652c5439362be7608be835a970634affaf",
  name: "updateCommissionStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateCommissionStatus.__executeServer(opts));
const updateCommissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  commissionId: stringType().uuid(),
  status: enumType(["pending", "approved", "available", "paid", "cancelled", "reversed"])
}).parse(input)).handler(updateCommissionStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    data: previous
  } = await db.from("commissions").select("status").eq("id", data.commissionId).maybeSingle();
  await db.from("commissions").update({
    status: data.status
  }).eq("id", data.commissionId);
  await audit(context.userId, "commission.status", data.commissionId, previous?.status ?? null, data.status);
  return {
    ok: true
  };
});
const updatePayoutStatus_createServerFn_handler = createServerRpc({
  id: "fbd372f9e2bf2e908d56e8f9a0c668d730c5610addadcf26b768c2651bb3d692",
  name: "updatePayoutStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updatePayoutStatus.__executeServer(opts));
const updatePayoutStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  payoutId: stringType().uuid(),
  status: enumType(["requested", "under_review", "approved", "processing", "paid", "rejected"]),
  notes: stringType().trim().max(300).optional()
}).parse(input)).handler(updatePayoutStatus_createServerFn_handler, async ({
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
  } = await db.from("payouts").select("*, partners(user_id)").eq("id", data.payoutId).maybeSingle();
  if (!payout) return {
    ok: false,
    error: "Payout not found."
  };
  await db.from("payouts").update({
    status: data.status,
    notes: data.notes ?? null
  }).eq("id", data.payoutId);
  if (data.status === "paid") {
    const {
      data: rows
    } = await db.from("commissions").select("id,amount").eq("partner_id", payout.partner_id).eq("status", "available").order("created_at", {
      ascending: true
    });
    let remaining = Number(payout.amount);
    for (const row of rows ?? []) {
      if (remaining <= 0) break;
      await db.from("commissions").update({
        status: "paid"
      }).eq("id", row.id);
      remaining -= Number(row.amount);
    }
  }
  const partnerUser = payout.partners?.user_id;
  if (partnerUser) await notify(partnerUser, "Payout update", `Your payout of ₹${Number(payout.amount).toFixed(2)} is now ${data.status.replace("_", " ")}.`, "payout");
  await audit(context.userId, "payout.status", data.payoutId, payout.status, data.status);
  return {
    ok: true
  };
});
const upsertProduct_createServerFn_handler = createServerRpc({
  id: "87057b699c92d5e9cc4f021e767a44009606525481c8a27886c5fc0375dc6625",
  name: "upsertProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => upsertProduct.__executeServer(opts));
const upsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid().optional(),
  name: stringType().trim().min(2).max(120),
  slug: stringType().trim().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and dashes"),
  sku: stringType().trim().min(2).max(40),
  category: stringType().trim().min(2).max(40),
  short_description: stringType().trim().max(200).optional(),
  description: stringType().trim().max(2e3).optional(),
  image_url: stringType().trim().max(500).optional().nullable(),
  price: numberType().positive(),
  sale_price: numberType().positive().nullable().optional(),
  stock: numberType().int().min(0),
  status: enumType(["active", "inactive"]),
  featured: booleanType(),
  commission_percent: numberType().min(0).max(80).nullable().optional()
}).parse(input)).handler(upsertProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    error
  } = await db.from("products").upsert(data, {
    onConflict: "id"
  });
  if (error) return {
    ok: false,
    error: error.message
  };
  await audit(context.userId, data.id ? "product.update" : "product.create", data.slug, null, {
    name: data.name,
    price: data.price
  });
  return {
    ok: true
  };
});
const upsertMarketingAsset_createServerFn_handler = createServerRpc({
  id: "2f46a1d5dd660888216940456c90ada664f49d8ff7264050c40b4d63e7ddabae",
  name: "upsertMarketingAsset",
  filename: "src/lib/admin.functions.ts"
}, (opts) => upsertMarketingAsset.__executeServer(opts));
const upsertMarketingAsset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid().optional(),
  title: stringType().trim().min(2).max(120),
  description: stringType().trim().max(400).optional(),
  category: stringType().trim().min(2).max(40),
  image_url: stringType().trim().max(500).optional().nullable(),
  body_text: stringType().trim().max(1200).optional(),
  status: enumType(["active", "inactive"])
}).parse(input)).handler(upsertMarketingAsset_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const {
    error
  } = await db.from("marketing_assets").upsert(data, {
    onConflict: "id"
  });
  if (error) return {
    ok: false,
    error: error.message
  };
  return {
    ok: true
  };
});
const deleteMarketingAsset_createServerFn_handler = createServerRpc({
  id: "77b01287e528732195ab708a742ff87badd7ccaceae23dd75d6fe75d168caf1b",
  name: "deleteMarketingAsset",
  filename: "src/lib/admin.functions.ts"
}, (opts) => deleteMarketingAsset.__executeServer(opts));
const deleteMarketingAsset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteMarketingAsset_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  await db.from("marketing_assets").delete().eq("id", data.id);
  return {
    ok: true
  };
});
const setCustomerBlocked_createServerFn_handler = createServerRpc({
  id: "2307164cc2eaa44278ff5f5ea43d5a8da63ec996663aa63c91b01f749276ba85",
  name: "setCustomerBlocked",
  filename: "src/lib/admin.functions.ts"
}, (opts) => setCustomerBlocked.__executeServer(opts));
const setCustomerBlocked = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  blocked: booleanType()
}).parse(input)).handler(setCustomerBlocked_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  await db.from("profiles").update({
    blocked: data.blocked
  }).eq("id", data.userId);
  await audit(context.userId, "customer.blocked", data.userId, null, data.blocked);
  return {
    ok: true
  };
});
export {
  deleteMarketingAsset_createServerFn_handler,
  setCustomerBlocked_createServerFn_handler,
  updateCommissionStatus_createServerFn_handler,
  updateOrderStatus_createServerFn_handler,
  updatePartnerStatus_createServerFn_handler,
  updatePayoutStatus_createServerFn_handler,
  updateSetting_createServerFn_handler,
  upsertMarketingAsset_createServerFn_handler,
  upsertProduct_createServerFn_handler
};
