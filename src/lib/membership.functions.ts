import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, getSetting, notify } from "./platform.server";
import type { MembershipSettings, PaymentSettings } from "./platform.server";

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
    if (existing?.status === "pending")
      return { ok: false as const, error: "Your partner application is already pending admin approval." };

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
      razorpayKeyId: process.env["RAZORPAY_KEY_ID"] ?? null,
    };
  });

/** Verify payment, then create a pending partner application. Admin approval activates it. */
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
    if (txn.status === "success") return { ok: false as const, error: "This payment has already been processed." };

    if (!payment.demo_mode) {
      const secret = process.env["RAZORPAY_KEY_SECRET"];
      if (!secret || !data.signature)
        return { ok: false as const, error: "Payment verification is not configured yet." };
    }

    const { data: existing } = await db
      .from("partners")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing?.status === "active")
      return { ok: false as const, error: "You already have an active partner membership." };
    if (existing?.status === "pending")
      return { ok: false as const, error: "Your partner application is already pending admin approval." };

    const paymentId = data.gatewayPaymentId ?? `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    const randomCode = () => `HF-P-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const randomReferral = () => `HIND-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    let partner: { id: string; partner_code: string; referral_code: string; status: string } | null = null;
    for (let attempt = 0; attempt < 3 && !partner; attempt++) {
      const { data: created, error } = await db
        .from("partners")
        .insert({ user_id: context.userId, partner_code: randomCode(), referral_code: randomReferral(), status: "pending" })
        .select("id,partner_code,referral_code,status")
        .single();
      if (!error) partner = created;
    }
    if (!partner) return { ok: false as const, error: "Could not create partner application." };

    await db
      .from("transactions")
      .update({ status: "success", gateway_payment_id: paymentId, partner_id: partner.id })
      .eq("id", txn.id);

    await notify(
      context.userId,
      "Partner application submitted",
      `Payment received. Your Partner ID is ${partner.partner_code}. Your application is pending admin approval.`,
      "membership",
    );

    return {
      ok: true as const,
      partnerCode: partner.partner_code,
      referralCode: partner.referral_code,
      status: partner.status,
      paymentId,
    };
  });
