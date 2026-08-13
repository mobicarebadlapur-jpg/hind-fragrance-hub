import { createServerFn } from "@tanstack/react-start";
import { admin } from "./platform.server";

/**
 * Idempotently provisions the demo admin / partner / customer accounts so the
 * whole platform can be tested without any third-party credentials.
 * DEMO ONLY — remove or protect this endpoint before going live.
 */
export const seedDemoAccounts = createServerFn({ method: "POST" }).handler(async () => {
  const db = await admin();
  const accounts = [
    { email: "admin@hindfragrance.com", password: "Admin@199", name: "Hind Admin", role: "admin" },
    {
      email: "partner@hindfragrance.com",
      password: "Partner@199",
      name: "Demo Partner",
      role: "partner",
    },
    {
      email: "customer@hindfragrance.com",
      password: "Customer@199",
      name: "Demo Customer",
      role: "customer",
    },
  ] as const;

  const ids: Record<string, string> = {};

  for (const account of accounts) {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users.find((u) => u.email === account.email);
    let userId = found?.id;
    if (!userId) {
      const { data: created, error } = await db.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.name },
      });
      if (error || !created.user) continue;
      userId = created.user.id;
    }
    ids[account.role] = userId;
    await db
      .from("profiles")
      .upsert({ id: userId, full_name: account.name, email: account.email, mobile: "9000000000" });
    await db
      .from("user_roles")
      .upsert({ user_id: userId, role: account.role }, { onConflict: "user_id,role" });
    if (account.role !== "customer")
      await db
        .from("user_roles")
        .upsert({ user_id: userId, role: "customer" }, { onConflict: "user_id,role" });
  }

  // Demo partner membership with the documented demo referral code.
  const partnerUser = ids["partner"];
  if (partnerUser) {
    const { data: existing } = await db
      .from("partners")
      .select("id")
      .eq("user_id", partnerUser)
      .maybeSingle();
    if (!existing) {
      await db.from("partners").insert({
        user_id: partnerUser,
        partner_code: "HFBP10001",
        referral_code: "HFDEMO10001",
        status: "active",
        membership_price: 199,
        membership_date: new Date().toISOString(),
        payment_id: "pay_demo_membership",
      });
      const { data: partner } = await db
        .from("partners")
        .select("id")
        .eq("user_id", partnerUser)
        .maybeSingle();
      if (partner)
        await db.from("transactions").insert({
          user_id: partnerUser,
          partner_id: partner.id,
          amount: 199,
          gateway: "demo",
          gateway_order_id: "demo_membership_seed",
          gateway_payment_id: "pay_demo_membership",
          status: "success",
          payment_type: "membership",
        });
    }
  }

  return {
    ok: true as const,
    accounts: accounts.map((a) => ({ email: a.email, password: a.password, role: a.role })),
    referralCode: "HFDEMO10001",
  };
});
