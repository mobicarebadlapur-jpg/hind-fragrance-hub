import { c as createServerRpc, a as admin } from "./platform.server-IEPmGFG3.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const ensureProfile_createServerFn_handler = createServerRpc({
  id: "c9b5765a75eeb9be9d80dd75da8af33c2c15aa41b6ea8074b14840f330e971e8",
  name: "ensureProfile",
  filename: "src/lib/account.functions.ts"
}, (opts) => ensureProfile.__executeServer(opts));
const ensureProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  full_name: stringType().trim().max(100).optional(),
  mobile: stringType().trim().max(15).optional(),
  address: stringType().trim().max(300).optional(),
  city: stringType().trim().max(80).optional(),
  state: stringType().trim().max(80).optional(),
  pincode: stringType().trim().max(10).optional()
}).parse(input ?? {})).handler(ensureProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const db = await admin();
  const {
    data: existing
  } = await db.from("profiles").select("id,full_name").eq("id", context.userId).maybeSingle();
  await db.from("profiles").upsert({
    id: context.userId,
    email: context.claims?.email ?? null,
    full_name: data.full_name ?? existing?.full_name ?? "",
    ...data.mobile ? {
      mobile: data.mobile
    } : {},
    ...data.address ? {
      address: data.address
    } : {},
    ...data.city ? {
      city: data.city
    } : {},
    ...data.state ? {
      state: data.state
    } : {},
    ...data.pincode ? {
      pincode: data.pincode
    } : {}
  });
  await db.from("user_roles").upsert({
    user_id: context.userId,
    role: "customer"
  }, {
    onConflict: "user_id,role"
  });
  return {
    ok: true
  };
});
const markNotificationsRead_createServerFn_handler = createServerRpc({
  id: "c87ea2d8ea7b5701200fb3d9a67d099edd07cf7c7c4e6d40f22e6d358e6f4a86",
  name: "markNotificationsRead",
  filename: "src/lib/account.functions.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
const markNotificationsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(markNotificationsRead_createServerFn_handler, async ({
  context
}) => {
  const db = await admin();
  await db.from("notifications").update({
    read: true
  }).eq("user_id", context.userId).eq("read", false);
  return {
    ok: true
  };
});
export {
  ensureProfile_createServerFn_handler,
  markNotificationsRead_createServerFn_handler
};
