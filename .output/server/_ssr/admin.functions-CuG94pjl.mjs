import { c as createServerRpc, i as isAdmin, a as admin, b as audit, n as notify } from "./platform.server-D-7H_oIi.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, b as booleanType, n as numberType, s as stringType, r as recordType, u as unknownType } from "../_libs/zod.mjs";
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
const PRODUCT_STATUSES = ["active", "draft", "archived"];
const productSchema = objectType({
  id: stringType().uuid().optional(),
  sku: stringType().trim().min(2).max(64),
  slug: stringType().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: stringType().trim().min(2).max(200),
  category: stringType().trim().min(2).max(80),
  short_description: stringType().trim().max(300).nullable().optional(),
  description: stringType().trim().max(5e3).nullable().optional(),
  image_url: stringType().trim().url().max(1e3).nullable().optional(),
  price: numberType().min(0),
  sale_price: numberType().min(0).nullable().optional(),
  stock: numberType().int().min(0),
  commission_percent: numberType().min(0).max(100).nullable().optional(),
  featured: booleanType(),
  status: enumType(PRODUCT_STATUSES)
}).superRefine((value, ctx) => {
  if (value.sale_price != null && value.sale_price > value.price) ctx.addIssue({
    code: "custom",
    path: ["sale_price"],
    message: "Sale price cannot exceed price."
  });
});
const listAdminPartners_createServerFn_handler = createServerRpc({
  id: "8cef470f6abe6c80e4a225674dafd9c7ea938b4c45d9833ec6dbd26f095a1c0d",
  name: "listAdminPartners",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listAdminPartners.__executeServer(opts));
const listAdminPartners = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminPartners_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden",
    partners: []
  };
  const db = await admin();
  const {
    data,
    error
  } = await db.from("partners").select("id,user_id,partner_code,referral_code,status,joined_at,created_at").order("created_at", {
    ascending: false
  });
  if (error) return {
    ok: false,
    error: error.message,
    partners: []
  };
  return {
    ok: true,
    partners: data ?? []
  };
});
const listAdminProducts_createServerFn_handler = createServerRpc({
  id: "be89d9609832320cde8bceea123c378285db708e3ed11c71c8c450e6d25627f9",
  name: "listAdminProducts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listAdminProducts.__executeServer(opts));
const listAdminProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminProducts_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden",
    products: []
  };
  const db = await admin();
  const {
    data,
    error
  } = await db.from("products").select("*").order("created_at", {
    ascending: false
  });
  if (error) return {
    ok: false,
    error: error.message,
    products: []
  };
  return {
    ok: true,
    products: data ?? []
  };
});
const upsertAdminProduct_createServerFn_handler = createServerRpc({
  id: "5531a0135ee81507b0e495a270d3ce8472d5051d8c02110013b2cce4d1b6e863",
  name: "upsertAdminProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => upsertAdminProduct.__executeServer(opts));
const upsertAdminProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => productSchema.parse(input)).handler(upsertAdminProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const payload = {
    ...data.id ? {
      id: data.id
    } : {},
    sku: data.sku,
    slug: data.slug,
    name: data.name,
    category: data.category,
    short_description: data.short_description ?? null,
    description: data.description ?? null,
    image_url: data.image_url ?? null,
    price: data.price,
    sale_price: data.sale_price ?? null,
    stock: data.stock,
    commission_percent: data.commission_percent ?? null,
    featured: data.featured,
    status: data.status
  };
  const {
    error
  } = await db.from("products").upsert(payload, {
    onConflict: "id"
  });
  if (error) return {
    ok: false,
    error: error.message
  };
  await audit(context.userId, data.id ? "product.update" : "product.create", data.slug, null, {
    name: data.name,
    sku: data.sku,
    price: data.price,
    sale_price: data.sale_price ?? null,
    stock: data.stock,
    status: data.status
  });
  return {
    ok: true
  };
});
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
  const {
    error
  } = await db.from("app_settings").upsert({
    key: data.key,
    value: data.value,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (error) return {
    ok: false,
    error: error.message
  };
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
  status: enumType(["pending", "active", "suspended", "cancelled"])
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
  if (!previous) return {
    ok: false,
    error: "Partner not found."
  };
  const {
    error
  } = await db.from("partners").update({
    status: data.status
  }).eq("id", data.partnerId);
  if (error) return {
    ok: false,
    error: error.message
  };
  const role = data.status === "active" ? "partner" : "customer";
  const {
    error: profileError
  } = await db.from("profiles").update({
    role
  }).eq("id", previous.user_id);
  if (profileError) return {
    ok: false,
    error: profileError.message
  };
  await audit(context.userId, "partner.status", previous.partner_code ?? data.partnerId, previous.status, data.status);
  await notify(previous.user_id, "Partner account updated", `Your partner account status is now ${data.status.replace("_", " ")}.`, "partner");
  return {
    ok: true
  };
});
const listAdminOrders_createServerFn_handler = createServerRpc({
  id: "430f91f9a9f7a7376fb2ed41e1c89e591e9fd715a99b08e873ca878022596d66",
  name: "listAdminOrders",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listAdminOrders.__executeServer(opts));
const listAdminOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminOrders_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden",
    orders: []
  };
  const db = await admin();
  const {
    data,
    error
  } = await db.from("orders").select("id,order_number,customer_id,partner_id,referral_code,subtotal,discount,tax,shipping,total,payment_id,status,shipping_name,mobile,address,city,state,pincode,created_at,updated_at,order_items(id,product_name,quantity,unit_price,line_total),commissions(id,amount,status,partner_id)").order("created_at", {
    ascending: false
  });
  if (error) return {
    ok: false,
    error: error.message,
    orders: []
  };
  return {
    ok: true,
    orders: data ?? []
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
  status: enumType(["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"])
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
  } = await db.from("orders").select("status,order_number,customer_id").eq("id", data.orderId).maybeSingle();
  if (!previous) return {
    ok: false,
    error: "Order not found."
  };
  const {
    error
  } = await db.from("orders").update({
    status: data.status
  }).eq("id", data.orderId);
  if (error) return {
    ok: false,
    error: error.message
  };
  if (data.status === "delivered") await db.from("commissions").update({
    status: "approved"
  }).eq("order_id", data.orderId).eq("status", "pending");
  if (data.status === "cancelled" || data.status === "refunded") await db.from("commissions").update({
    status: "cancelled"
  }).eq("order_id", data.orderId).in("status", ["pending", "approved"]);
  await audit(context.userId, "order.status", previous.order_number, previous.status, data.status);
  await notify(previous.customer_id, "Order status updated", `Order ${previous.order_number} is now ${data.status.replace("_", " ")}.`, "order");
  return {
    ok: true
  };
});
const getAdminDashboardSummary_createServerFn_handler = createServerRpc({
  id: "210e27ea4b9ea1993cec9710e15a8c67ff92a7fd103c2fefc176790c89bfff0d",
  name: "getAdminDashboardSummary",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminDashboardSummary.__executeServer(opts));
const getAdminDashboardSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAdminDashboardSummary_createServerFn_handler, async ({
  context
}) => {
  if (!await isAdmin(context.userId)) return {
    ok: false,
    error: "Forbidden"
  };
  const db = await admin();
  const [{
    data: orders,
    error: ordersError
  }, {
    data: commissions,
    error: commissionsError
  }, {
    data: partners,
    error: partnersError
  }, {
    data: products,
    error: productsError
  }] = await Promise.all([db.from("orders").select("id,total,status,created_at"), db.from("commissions").select("amount,status"), db.from("partners").select("id,status"), db.from("products").select("id,status,stock")]);
  if (ordersError || commissionsError || partnersError || productsError) return {
    ok: false,
    error: ordersError?.message ?? commissionsError?.message ?? partnersError?.message ?? productsError?.message ?? "Could not load dashboard."
  };
  const rows = orders ?? [];
  const paidStatuses = /* @__PURE__ */ new Set(["paid", "processing", "shipped", "delivered"]);
  const paidOrders = rows.filter((o) => paidStatuses.has(o.status));
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const pendingPayments = rows.filter((o) => o.status === "payment_pending").reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const cancelledRevenue = rows.filter((o) => ["cancelled", "refunded"].includes(o.status)).reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const commissionByStatus = (status) => (commissions ?? []).filter((c) => c.status === status).reduce((sum, c) => sum + Number(c.amount ?? 0), 0);
  const recent = [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
  return {
    ok: true,
    summary: {
      revenue,
      paidOrders: paidOrders.length,
      totalOrders: rows.length,
      pendingPayments,
      cancelledRevenue,
      commissionsPending: commissionByStatus("pending"),
      commissionsApproved: commissionByStatus("approved"),
      commissionsAvailable: commissionByStatus("available"),
      commissionsPaid: commissionByStatus("paid"),
      activePartners: (partners ?? []).filter((p) => p.status === "active").length,
      pendingPartners: (partners ?? []).filter((p) => p.status === "pending").length,
      activeProducts: (products ?? []).filter((p) => p.status === "active").length,
      lowStockProducts: (products ?? []).filter((p) => p.status === "active" && Number(p.stock) <= 5).length,
      recent
    }
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
  const {
    error
  } = await db.from("commissions").update({
    status: data.status
  }).eq("id", data.commissionId);
  if (error) return {
    ok: false,
    error: error.message
  };
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
  const {
    error
  } = await db.from("payouts").update({
    status: data.status,
    notes: data.notes ?? null
  }).eq("id", data.payoutId);
  if (error) return {
    ok: false,
    error: error.message
  };
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
  const {
    error
  } = await db.from("marketing_assets").delete().eq("id", data.id);
  if (error) return {
    ok: false,
    error: error.message
  };
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
  const {
    error
  } = await db.from("profiles").update({
    blocked: data.blocked
  }).eq("id", data.userId);
  if (error) return {
    ok: false,
    error: error.message
  };
  await audit(context.userId, "customer.blocked", data.userId, null, data.blocked);
  return {
    ok: true
  };
});
export {
  deleteMarketingAsset_createServerFn_handler,
  getAdminDashboardSummary_createServerFn_handler,
  listAdminOrders_createServerFn_handler,
  listAdminPartners_createServerFn_handler,
  listAdminProducts_createServerFn_handler,
  setCustomerBlocked_createServerFn_handler,
  updateCommissionStatus_createServerFn_handler,
  updateOrderStatus_createServerFn_handler,
  updatePartnerStatus_createServerFn_handler,
  updatePayoutStatus_createServerFn_handler,
  updateSetting_createServerFn_handler,
  upsertAdminProduct_createServerFn_handler,
  upsertMarketingAsset_createServerFn_handler
};
