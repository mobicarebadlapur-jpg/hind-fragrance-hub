import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { admin, audit, isAdmin, notify } from "./platform.server";

export const updateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ key: z.string().min(2).max(40), value: z.record(z.unknown()) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: previous } = await db
      .from("app_settings")
      .select("value")
      .eq("key", data.key)
      .maybeSingle();
    await db
      .from("app_settings")
      .upsert({ key: data.key, value: data.value as never, updated_at: new Date().toISOString() });
    await audit(context.userId, "settings.update", data.key, previous?.value ?? null, data.value);
    return { ok: true as const };
  });

export const updatePartnerStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        partnerId: z.string().uuid(),
        status: z.enum(["pending", "payment_pending", "active", "suspended", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: previous } = await db
      .from("partners")
      .select("status,user_id,partner_code")
      .eq("id", data.partnerId)
      .maybeSingle();
    await db.from("partners").update({ status: data.status }).eq("id", data.partnerId);
    await audit(
      context.userId,
      "partner.status",
      previous?.partner_code ?? data.partnerId,
      previous?.status ?? null,
      data.status,
    );
    if (previous?.user_id)
      await notify(
        previous.user_id,
        "Partner account updated",
        `Your partner account status is now ${data.status.replace("_", " ")}.`,
        "partner",
      );
    return { ok: true as const };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum([
          "created",
          "payment_pending",
          "paid",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "refunded",
          "returned",
        ]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: previous } = await db
      .from("orders")
      .select("status,order_number")
      .eq("id", data.orderId)
      .maybeSingle();
    await db.from("orders").update({ status: data.status }).eq("id", data.orderId);
    // Delivery clears the commission for approval (holding period already stored).
    if (data.status === "delivered")
      await db
        .from("commissions")
        .update({ status: "approved" })
        .eq("order_id", data.orderId)
        .eq("status", "pending");
    await audit(
      context.userId,
      "order.status",
      previous?.order_number ?? data.orderId,
      previous?.status ?? null,
      data.status,
    );
    return { ok: true as const };
  });

export const updateCommissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        commissionId: z.string().uuid(),
        status: z.enum(["pending", "approved", "available", "paid", "cancelled", "reversed"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: previous } = await db
      .from("commissions")
      .select("status")
      .eq("id", data.commissionId)
      .maybeSingle();
    await db.from("commissions").update({ status: data.status }).eq("id", data.commissionId);
    await audit(
      context.userId,
      "commission.status",
      data.commissionId,
      previous?.status ?? null,
      data.status,
    );
    return { ok: true as const };
  });

export const updatePayoutStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        payoutId: z.string().uuid(),
        status: z.enum([
          "requested",
          "under_review",
          "approved",
          "processing",
          "paid",
          "rejected",
        ]),
        notes: z.string().trim().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { data: payout } = await db
      .from("payouts")
      .select("*, partners(user_id)")
      .eq("id", data.payoutId)
      .maybeSingle();
    if (!payout) return { ok: false as const, error: "Payout not found." };

    await db
      .from("payouts")
      .update({ status: data.status, notes: data.notes ?? null })
      .eq("id", data.payoutId);

    // Marking a payout paid settles the matching available commissions.
    if (data.status === "paid") {
      const { data: rows } = await db
        .from("commissions")
        .select("id,amount")
        .eq("partner_id", payout.partner_id)
        .eq("status", "available")
        .order("created_at", { ascending: true });
      let remaining = Number(payout.amount);
      for (const row of rows ?? []) {
        if (remaining <= 0) break;
        await db.from("commissions").update({ status: "paid" }).eq("id", row.id);
        remaining -= Number(row.amount);
      }
    }

    const partnerUser = (payout as { partners: { user_id: string } | null }).partners?.user_id;
    if (partnerUser)
      await notify(
        partnerUser,
        "Payout update",
        `Your payout of ₹${Number(payout.amount).toFixed(2)} is now ${data.status.replace("_", " ")}.`,
        "payout",
      );
    await audit(context.userId, "payout.status", data.payoutId, payout.status, data.status);
    return { ok: true as const };
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().trim().min(2).max(120),
        slug: z
          .string()
          .trim()
          .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and dashes"),
        sku: z.string().trim().min(2).max(40),
        category: z.string().trim().min(2).max(40),
        short_description: z.string().trim().max(200).optional(),
        description: z.string().trim().max(2000).optional(),
        image_url: z.string().trim().max(500).optional().nullable(),
        price: z.number().positive(),
        sale_price: z.number().positive().nullable().optional(),
        stock: z.number().int().min(0),
        status: z.enum(["active", "inactive"]),
        featured: z.boolean(),
        commission_percent: z.number().min(0).max(80).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { error } = await db.from("products").upsert(data as never, { onConflict: "id" });
    if (error) return { ok: false as const, error: error.message };
    await audit(context.userId, data.id ? "product.update" : "product.create", data.slug, null, {
      name: data.name,
      price: data.price,
    });
    return { ok: true as const };
  });

export const upsertMarketingAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        title: z.string().trim().min(2).max(120),
        description: z.string().trim().max(400).optional(),
        category: z.string().trim().min(2).max(40),
        image_url: z.string().trim().max(500).optional().nullable(),
        body_text: z.string().trim().max(1200).optional(),
        status: z.enum(["active", "inactive"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    const { error } = await db.from("marketing_assets").upsert(data as never, { onConflict: "id" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const deleteMarketingAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    await db.from("marketing_assets").delete().eq("id", data.id);
    return { ok: true as const };
  });

export const setCustomerBlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), blocked: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) return { ok: false as const, error: "Forbidden" };
    const db = await admin();
    await db.from("profiles").update({ blocked: data.blocked }).eq("id", data.userId);
    await audit(context.userId, "customer.blocked", data.userId, null, data.blocked);
    return { ok: true as const };
  });
