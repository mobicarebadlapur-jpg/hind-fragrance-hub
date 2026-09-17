import { c as createSsrRpc } from "./createSsrRpc-DMPreFkr.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import { o as objectType, e as enumType, s as stringType, b as booleanType, n as numberType, r as recordType, u as unknownType } from "../_libs/zod.mjs";
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
const listAdminPartners = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("8cef470f6abe6c80e4a225674dafd9c7ea938b4c45d9833ec6dbd26f095a1c0d"));
const listAdminProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("be89d9609832320cde8bceea123c378285db708e3ed11c71c8c450e6d25627f9"));
const upsertAdminProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => productSchema.parse(input)).handler(createSsrRpc("5531a0135ee81507b0e495a270d3ce8472d5051d8c02110013b2cce4d1b6e863"));
const upsertProduct = upsertAdminProduct;
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  key: stringType().min(2).max(40),
  value: recordType(unknownType())
}).parse(input)).handler(createSsrRpc("742f70fd777ae551ad3e3d3d2db22cdd962f265a6451e0c71a29e8525bb6c8b6"));
const updatePartnerStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  partnerId: stringType().uuid(),
  status: enumType(["pending", "active", "suspended", "cancelled"])
}).parse(input)).handler(createSsrRpc("bb217f220b6ee2e07fd572ac6c94b91d49f4222202511ecfdf722c60f9f152ad"));
const listAdminOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("430f91f9a9f7a7376fb2ed41e1c89e591e9fd715a99b08e873ca878022596d66"));
const updateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  status: enumType(["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"])
}).parse(input)).handler(createSsrRpc("573e69518e877f2ce18e3820832cb2cb45d1a897de1933c05de86f50fa9a7e10"));
const getAdminDashboardSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("210e27ea4b9ea1993cec9710e15a8c67ff92a7fd103c2fefc176790c89bfff0d"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  commissionId: stringType().uuid(),
  status: enumType(["pending", "approved", "available", "paid", "cancelled", "reversed"])
}).parse(input)).handler(createSsrRpc("1e39cb8e06d355ded8768a07115b74652c5439362be7608be835a970634affaf"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  payoutId: stringType().uuid(),
  status: enumType(["requested", "under_review", "approved", "processing", "paid", "rejected"]),
  notes: stringType().trim().max(300).optional()
}).parse(input)).handler(createSsrRpc("fbd372f9e2bf2e908d56e8f9a0c668d730c5610addadcf26b768c2651bb3d692"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid().optional(),
  title: stringType().trim().min(2).max(120),
  description: stringType().trim().max(400).optional(),
  category: stringType().trim().min(2).max(40),
  image_url: stringType().trim().max(500).optional().nullable(),
  body_text: stringType().trim().max(1200).optional(),
  status: enumType(["active", "inactive"])
}).parse(input)).handler(createSsrRpc("2f46a1d5dd660888216940456c90ada664f49d8ff7264050c40b4d63e7ddabae"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("77b01287e528732195ab708a742ff87badd7ccaceae23dd75d6fe75d168caf1b"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  userId: stringType().uuid(),
  blocked: booleanType()
}).parse(input)).handler(createSsrRpc("2307164cc2eaa44278ff5f5ea43d5a8da63ec996663aa63c91b01f749276ba85"));
export {
  updatePartnerStatus as a,
  upsertProduct as b,
  listAdminProducts as c,
  listAdminOrders as d,
  getAdminDashboardSummary as g,
  listAdminPartners as l,
  updateOrderStatus as u
};
