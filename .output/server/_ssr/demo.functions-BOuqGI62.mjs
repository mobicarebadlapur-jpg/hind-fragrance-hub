import { c as createServerRpc, a as admin } from "./platform.server-tvadrG6h.mjs";
import { c as createServerFn } from "./server-dt98x2q-.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const seedDemoAccounts_createServerFn_handler = createServerRpc({
  id: "e42712be89fe2c5a6044deebf084d5708d7ff0349ebf1793bc67d58e26337b8c",
  name: "seedDemoAccounts",
  filename: "src/lib/demo.functions.ts"
}, (opts) => seedDemoAccounts.__executeServer(opts));
const seedDemoAccounts = createServerFn({
  method: "POST"
}).handler(seedDemoAccounts_createServerFn_handler, async () => {
  if (process.env["DEMO_ACCESS_ENABLED"] !== "true") {
    throw new Error("Demo account seeding is disabled");
  }
  const db = await admin();
  const accounts = [{
    email: "admin@hindfragrance.com",
    password: "Admin@199",
    name: "Hind Admin",
    role: "admin"
  }, {
    email: "partner@hindfragrance.com",
    password: "Partner@199",
    name: "Demo Partner",
    role: "partner"
  }, {
    email: "customer@hindfragrance.com",
    password: "Customer@199",
    name: "Demo Customer",
    role: "customer"
  }];
  const ids = {};
  for (const account of accounts) {
    const {
      data: list
    } = await db.auth.admin.listUsers({
      page: 1,
      perPage: 200
    });
    const found = list?.users.find((u) => u.email === account.email);
    let userId = found?.id;
    if (!userId) {
      const {
        data: created,
        error
      } = await db.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.name
        }
      });
      if (error || !created.user) continue;
      userId = created.user.id;
    }
    ids[account.role] = userId;
    await db.from("profiles").upsert({
      id: userId,
      full_name: account.name,
      email: account.email,
      mobile: "9000000000"
    });
    await db.from("user_roles").upsert({
      user_id: userId,
      role: account.role
    }, {
      onConflict: "user_id,role"
    });
    if (account.role !== "customer") await db.from("user_roles").upsert({
      user_id: userId,
      role: "customer"
    }, {
      onConflict: "user_id,role"
    });
  }
  const partnerUser = ids["partner"];
  if (partnerUser) {
    const {
      data: existing
    } = await db.from("partners").select("id").eq("user_id", partnerUser).maybeSingle();
    if (!existing) {
      await db.from("partners").insert({
        user_id: partnerUser,
        partner_code: "HFBP10001",
        referral_code: "HFDEMO10001",
        status: "active",
        membership_price: 199,
        membership_date: (/* @__PURE__ */ new Date()).toISOString(),
        payment_id: "pay_demo_membership"
      });
      const {
        data: partner
      } = await db.from("partners").select("id").eq("user_id", partnerUser).maybeSingle();
      if (partner) await db.from("transactions").insert({
        user_id: partnerUser,
        partner_id: partner.id,
        amount: 199,
        gateway: "demo",
        gateway_order_id: "demo_membership_seed",
        gateway_payment_id: "pay_demo_membership",
        status: "success",
        payment_type: "membership"
      });
    }
  }
  return {
    ok: true,
    accounts: accounts.map((a) => ({
      email: a.email,
      password: a.password,
      role: a.role
    })),
    referralCode: "HFDEMO10001"
  };
});
export {
  seedDemoAccounts_createServerFn_handler
};
