import { T as TSS_SERVER_FUNCTION } from "./server-dt98x2q-.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
async function admin() {
  const { supabaseAdmin } = await import("./client.server-CK2Ilf7B.mjs");
  return supabaseAdmin;
}
async function getSetting(key, fallback) {
  const db = await admin();
  const { data } = await db.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? fallback;
}
async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function notify(userId, title, body, type = "general") {
  const db = await admin();
  await db.from("notifications").insert({ user_id: userId, title, body, type });
}
async function isAdmin(userId) {
  const db = await admin();
  const { data } = await db.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  return Boolean(data);
}
async function audit(adminId, action, target, oldValue, newValue) {
  const db = await admin();
  await db.from("audit_logs").insert({
    admin_id: adminId,
    action,
    target,
    old_value: oldValue,
    new_value: newValue
  });
}
async function availableBalance(partnerId) {
  const db = await admin();
  await db.from("commissions").update({ status: "available" }).eq("partner_id", partnerId).eq("status", "approved").lte("available_at", (/* @__PURE__ */ new Date()).toISOString());
  const [{ data: commissions }, { data: payouts }] = await Promise.all([
    db.from("commissions").select("amount,status").eq("partner_id", partnerId),
    db.from("payouts").select("amount,status").eq("partner_id", partnerId)
  ]);
  const earned = (commissions ?? []).filter((c) => c.status === "available").reduce((s, c) => s + Number(c.amount), 0);
  const locked = (payouts ?? []).filter((p) => p.status !== "rejected").reduce((s, p) => s + Number(p.amount), 0);
  return Math.max(earned - locked, 0);
}
export {
  admin as a,
  audit as b,
  createServerRpc as c,
  availableBalance as d,
  getSetting as g,
  isAdmin as i,
  notify as n,
  sha256 as s
};
