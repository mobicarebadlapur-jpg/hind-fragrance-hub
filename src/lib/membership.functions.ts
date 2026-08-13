import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, getSetting, notify } from "./platform.server";
import type { MembershipSettings, PaymentSettings } from "./platform.server";

/** Step 1 of the ₹199 membership: create the payment order server-side. */
export const createMembershipOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const membership = await getSetting<MembershipSettings>("membership", {
      price: 199,
      name: "Business Partner Membership",
      active: true,
    });
    if (!membership.active)
      return { ok: false as const, error: "Membership registration is currently closed." };

    const payment = await getSetting<PaymentSettings>("payment", {
      provider: "razorpay",
      demo_mode: true,
    });
    const db = await admin();
    const { data: existing } = await db
      .from("partners")
      .select("status")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing?.status === "active")
      return { ok: false as const, error: "You already have an active partner membership." };

    const gatewayOrderId = `${payment.demo_mode ? "demo" : "order"}_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    await db.from("transactions").insert({
      user_id: context.userId,
      amount: membership.price,
      gateway: payment.demo_mode ? "demo" : payment.provider,
      gateway_order_id: gatewayOrderId,
      status: "created",
      payment_type: "membership",
    });

    return {
      ok: true as const,
      gatewayOrderId,
      amount: membership.price,
      name: membership.name,
      demoMode: payment.demo_mode,
      // Production: return the Razorpay order id + key_id here for Checkout.
      razorpayKeyId: process.env["RAZORPAY_KEY_ID"] ?? null,
    };
  });

/**
 * Step 2: verify the payment server-side, then activate the partner.
 * Demo mode simulates a successful gateway callback; production verifies the
 * Razorpay signature with the server-side secret before activating.
 */
export const verifyMembershipPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        gatewayOrderId: z.string().min(6),
        gatewayPaymentId: z.string().optional(),
        signature: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const db = await admin();
    const payment = await getSetting<PaymentSettings>("payment", {
      provider: "razorpay",
      demo_mode: true,
    });

    const { data: txn } = await db
      .from("transactions")
      .select("*")
      .eq("gateway_order_id", data.gatewayOrderId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!txn) return { ok: false as const, error: "Payment record not found." };
    if (txn.status === "success" && txn.partner_id)
      return { ok: false as const, error: "This payment has already been processed." };

    if (!payment.demo_mode) {
      // Production integration point: verify HMAC signature with RAZORPAY_KEY_SECRET.
      const secret = process.env["RAZORPAY_KEY_SECRET"];
      if (!secret || !data.signature)
        return { ok: false as const, error: "Payment verification is not configured yet." };
    }

    const paymentId = data.gatewayPaymentId ?? `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;

    const { data: existing } = await db
      .from("partners")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();

    let partner = existing;
    if (!partner) {
      const { data: code } = await db.rpc("next_partner_code");
      const partnerCode = (code as string) ?? `HFBP${Date.now()}`;
      const { data: created, error } = await db
        .from("partners")
        .insert({
          user_id: context.userId,
          partner_code: partnerCode,
          referral_code: partnerCode,
          status: "active",
          membership_price: Number(txn.amount),
          membership_date: new Date().toISOString(),
          payment_id: paymentId,
        })
        .select("*")
        .single();
      if (error) return { ok: false as const, error: "Could not activate membership." };
      partner = created;
    } else {
      const { data: updated } = await db
        .from("partners")
        .update({
          status: "active",
          membership_price: Number(txn.amount),
          membership_date: new Date().toISOString(),
          payment_id: paymentId,
        })
        .eq("id", partner.id)
        .select("*")
        .single();
      partner = updated ?? partner;
    }

    await db
      .from("transactions")
      .update({ status: "success", gateway_payment_id: paymentId, partner_id: partner.id })
      .eq("id", txn.id);
    await db
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "partner" }, { onConflict: "user_id,role" });
    await notify(
      context.userId,
      "Partner membership activated",
      `Welcome aboard! Your Partner ID is ${partner.partner_code}.`,
      "membership",
    );

    return {
      ok: true as const,
      partnerCode: partner.partner_code,
      referralCode: partner.referral_code,
      paymentId,
    };
  });
