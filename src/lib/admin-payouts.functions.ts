import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, audit, isAdmin, notify } from "./platform.server";

const payoutStatus = z.enum(["requested", "under_review", "approved", "processing", "paid", "rejected"]);

export const listAdminPayouts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden", payouts: [] };
    const db = await admin();
    const { data, error } = await db
      .from("payouts")
      .select("id,partner_id,amount,method,account_holder,bank_name,status,notes,requested_at,processed_at,created_at,updated_at,account_number_last4,upi_id_masked,ifsc_masked,partners(partner_code,user_id)")
      .order("created_at", { ascending: false });
    if (error) return { ok: false as const, error: error.message, payouts: [] };
    return { ok: true as const, payouts: data ?? [] };
  });

export const updateAdminPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ payoutId: z.string().uuid(), status: payoutStatus, notes: z.string().trim().max(300).nullable().optional() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: payout } = await db.from("payouts").select("id,partner_id,amount,status,partners(user_id)").eq("id", data.payoutId).maybeSingle();
    if (!payout) return { ok: false as const, error: "Payout not found." };
    if (payout.status === "paid" && data.status !== "paid") return { ok: false as const, error: "Paid payouts cannot be moved backwards." };

    const patch: Record<string, unknown> = { status: data.status, notes: data.notes ?? null };
    if (["processing", "paid"].includes(data.status)) patch.processed_at = new Date().toISOString();
    const { error } = await db.from("payouts").update(patch).eq("id", data.payoutId);
    if (error) return { ok: false as const, error: error.message };

    if (data.status === "paid") {
      const { data: available } = await db.from("commissions").select("id,amount").eq("partner_id", payout.partner_id).eq("status", "available").order("created_at", { ascending: true });
      let remaining = Number(payout.amount);
      for (const commission of available ?? []) {
        if (remaining <= 0) break;
        const amount = Number(commission.amount);
        if (amount <= remaining) {
          const { error: commissionError } = await db.from("commissions").update({ status: "paid" }).eq("id", commission.id).eq("status", "available");
          if (!commissionError) remaining -= amount;
        }
      }
      if (remaining > 0.009) return { ok: false as const, error: "Payout marked paid but available commission balance was insufficient; review this payout." };
    }

    const partnerUser = (payout.partners as { user_id: string } | null)?.user_id;
    if (partnerUser) await notify(partnerUser, "Payout update", `Your payout of ₹${Number(payout.amount).toFixed(2)} is now ${data.status.replace("_", " ")}.`, "payout");
    await audit(context.userId, "payout.status", data.payoutId, payout.status, data.status);
    return { ok: true as const };
  });
