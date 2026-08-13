import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, availableBalance, getSetting, notify } from "./platform.server";
import type { CommissionSettings } from "./platform.server";

const payoutSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  method: z.enum(["bank", "upi"]),
  accountHolder: z.string().trim().max(100).optional(),
  bankName: z.string().trim().max(100).optional(),
  accountNumber: z.string().trim().max(30).optional(),
  ifsc: z.string().trim().max(20).optional(),
  upiId: z.string().trim().max(60).optional(),
});

export const getPartnerBalance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await admin();
    const { data: partner } = await db
      .from("partners")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!partner) return { available: 0, minPayout: 0 };
    const settings = await getSetting<CommissionSettings>("commission", {
      default_percent: 10,
      min_payout: 500,
      holding_days: 7,
      allow_product_specific: true,
      allow_category_specific: true,
      basis: "product_subtotal",
      exclude_shipping: true,
      exclude_tax: true,
      exclude_discounts: true,
    });
    return {
      available: await availableBalance(partner.id),
      minPayout: Number(settings.min_payout),
    };
  });

export const requestPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => payoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: partner } = await db
      .from("partners")
      .select("id,status")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!partner || partner.status !== "active")
      return { ok: false as const, error: "Only active business partners can request a payout." };

    const settings = await getSetting<CommissionSettings>("commission", {
      default_percent: 10,
      min_payout: 500,
      holding_days: 7,
      allow_product_specific: true,
      allow_category_specific: true,
      basis: "product_subtotal",
      exclude_shipping: true,
      exclude_tax: true,
      exclude_discounts: true,
    });
    const available = await availableBalance(partner.id);
    if (data.amount < Number(settings.min_payout))
      return {
        ok: false as const,
        error: `Minimum payout amount is ₹${settings.min_payout}.`,
      };
    if (data.amount > available)
      return {
        ok: false as const,
        error: `Insufficient balance. You currently have ₹${available.toFixed(2)} available.`,
      };
    if (data.method === "bank" && (!data.accountNumber || !data.ifsc || !data.accountHolder))
      return { ok: false as const, error: "Please provide complete bank details." };
    if (data.method === "upi" && !data.upiId)
      return { ok: false as const, error: "Please provide a valid UPI ID." };

    await db.from("payouts").insert({
      partner_id: partner.id,
      amount: data.amount,
      method: data.method,
      account_holder: data.accountHolder ?? null,
      bank_name: data.bankName ?? null,
      account_number: data.accountNumber ?? null,
      ifsc: data.ifsc ?? null,
      upi_id: data.upiId ?? null,
      status: "requested",
    });
    await notify(
      context.userId,
      "Payout requested",
      `Your payout request of ₹${data.amount.toFixed(2)} is under review.`,
      "payout",
    );
    return { ok: true as const };
  });
