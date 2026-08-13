import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin } from "./platform.server";

/** Creates/updates the caller's profile and guarantees a customer role. */
export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().trim().max(100).optional(),
        mobile: z.string().trim().max(15).optional(),
        address: z.string().trim().max(300).optional(),
        city: z.string().trim().max(80).optional(),
        state: z.string().trim().max(80).optional(),
        pincode: z.string().trim().max(10).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const db = await admin();
    const { data: existing } = await db
      .from("profiles")
      .select("id,full_name")
      .eq("id", context.userId)
      .maybeSingle();
    await db.from("profiles").upsert({
      id: context.userId,
      email: (context.claims as { email?: string } | null)?.email ?? null,
      full_name: data.full_name ?? existing?.full_name ?? "",
      ...(data.mobile ? { mobile: data.mobile } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.state ? { state: data.state } : {}),
      ...(data.pincode ? { pincode: data.pincode } : {}),
    });
    await db
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "customer" }, { onConflict: "user_id,role" });
    return { ok: true as const };
  });

/** Marks the caller's notifications as read. */
export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await admin();
    await db
      .from("notifications")
      .update({ read: true })
      .eq("user_id", context.userId)
      .eq("read", false);
    return { ok: true as const };
  });
