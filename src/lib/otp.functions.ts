import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { admin, getSetting, sha256 } from "./platform.server";

const mobileSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number"),
});

/**
 * Sends a time-limited, single-use OTP.
 * Demo mode returns the code so the flow is testable without an SMS provider.
 * Production: replace the `deliver` block with your SMS/WhatsApp provider call.
 */
export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => mobileSchema.parse(input))
  .handler(async ({ data }) => {
    const db = await admin();
    const since = new Date(Date.now() - 10 * 60_000).toISOString();
    const { count } = await db
      .from("otp_verifications")
      .select("id", { count: "exact", head: true })
      .eq("mobile", data.mobile)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      return {
        ok: false as const,
        error: "Too many OTP requests. Please try again in 10 minutes.",
      };
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await db.from("otp_verifications").insert({
      mobile: data.mobile,
      code_hash: await sha256(code),
      expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
    });

    const payment = await getSetting("payment", { provider: "razorpay", demo_mode: true });
    // deliver: production integration point (SMS / WhatsApp provider)
    return {
      ok: true as const,
      demo: payment.demo_mode,
      demoCode: payment.demo_mode ? code : null,
      expiresInSeconds: 300,
    };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    mobileSchema.extend({ code: z.string().trim().length(6) }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: record } = await db
      .from("otp_verifications")
      .select("*")
      .eq("mobile", data.mobile)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!record) return { ok: false as const, error: "No OTP found. Please request a new code." };
    if (new Date(record.expires_at).getTime() < Date.now())
      return { ok: false as const, error: "This OTP has expired. Request a new one." };
    if (record.attempts >= 5)
      return { ok: false as const, error: "Too many incorrect attempts. Request a new OTP." };

    if (record.code_hash !== (await sha256(data.code))) {
      await db
        .from("otp_verifications")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id);
      return { ok: false as const, error: "Incorrect OTP. Please check and try again." };
    }

    await db.from("otp_verifications").update({ used: true }).eq("id", record.id);
    return { ok: true as const };
  });
