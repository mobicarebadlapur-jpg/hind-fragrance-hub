import { c as createSsrRpc } from "./createSsrRpc-D_SPKSHh.mjs";
import { c as createServerFn } from "./server-CrL2kZQg.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-VIvM2KcA.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const ensureProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  full_name: stringType().trim().max(100).optional(),
  mobile: stringType().trim().max(15).optional(),
  address: stringType().trim().max(300).optional(),
  city: stringType().trim().max(80).optional(),
  state: stringType().trim().max(80).optional(),
  pincode: stringType().trim().max(10).optional()
}).parse(input ?? {})).handler(createSsrRpc("c9b5765a75eeb9be9d80dd75da8af33c2c15aa41b6ea8074b14840f330e971e8"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c87ea2d8ea7b5701200fb3d9a67d099edd07cf7c7c4e6d40f22e6d358e6f4a86"));
export {
  ensureProfile as e
};
