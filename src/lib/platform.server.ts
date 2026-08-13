/**
 * Server-only helpers shared by the platform's server functions.
 * Never import this file from a component or a module-scope of a route.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type AdminClient = SupabaseClient<Database>;

export async function admin(): Promise<AdminClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as AdminClient;
}

export type CommissionSettings = {
  default_percent: number;
  min_payout: number;
  holding_days: number;
  allow_product_specific: boolean;
  allow_category_specific: boolean;
  basis: string;
  exclude_shipping: boolean;
  exclude_tax: boolean;
  exclude_discounts: boolean;
};

export type MembershipSettings = { price: number; name: string; active: boolean };
export type PaymentSettings = { provider: string; demo_mode: boolean };

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const db = await admin();
  const { data } = await db.from("app_settings").select("value").eq("key", key).maybeSingle();
  return ((data?.value as T) ?? fallback) as T;
}

export async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function notify(userId: string, title: string, body: string, type = "general") {
  const db = await admin();
  await db.from("notifications").insert({ user_id: userId, title, body, type });
}

export async function isAdmin(userId: string): Promise<boolean> {
  const db = await admin();
  const { data } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

export async function audit(
  adminId: string,
  action: string,
  target: string,
  oldValue: unknown,
  newValue: unknown,
) {
  const db = await admin();
  await db.from("audit_logs").insert({
    admin_id: adminId,
    action,
    target,
    old_value: oldValue as never,
    new_value: newValue as never,
  });
}

/**
 * Available balance = approved commissions whose holding period has elapsed,
 * minus every payout that has not been rejected.
 */
export async function availableBalance(partnerId: string): Promise<number> {
  const db = await admin();
  await db
    .from("commissions")
    .update({ status: "available" })
    .eq("partner_id", partnerId)
    .eq("status", "approved")
    .lte("available_at", new Date().toISOString());

  const [{ data: commissions }, { data: payouts }] = await Promise.all([
    db.from("commissions").select("amount,status").eq("partner_id", partnerId),
    db.from("payouts").select("amount,status").eq("partner_id", partnerId),
  ]);
  const earned = (commissions ?? [])
    .filter((c) => c.status === "available")
    .reduce((s, c) => s + Number(c.amount), 0);
  const locked = (payouts ?? [])
    .filter((p) => p.status !== "rejected")
    .reduce((s, p) => s + Number(p.amount), 0);
  return Math.max(earned - locked, 0);
}
