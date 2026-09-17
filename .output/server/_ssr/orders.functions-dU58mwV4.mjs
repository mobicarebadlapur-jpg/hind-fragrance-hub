import { c as createSsrRpc } from "./createSsrRpc-DMPreFkr.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
const checkoutSchema = objectType({
  items: arrayType(objectType({
    productId: stringType().uuid(),
    quantity: numberType().int().min(1).max(20)
  })).min(1).max(30).superRefine((items, ctx) => {
    const ids = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (ids.has(item.productId)) {
        ctx.addIssue({
          code: "custom",
          path: ["items"],
          message: "Duplicate products are not allowed in checkout."
        });
        break;
      }
      ids.add(item.productId);
    }
  }),
  referralCode: stringType().trim().max(32).optional().nullable(),
  referralVisitorId: stringType().uuid().optional().nullable(),
  shippingName: stringType().trim().min(2).max(100),
  mobile: stringType().trim().regex(/^[0-9]{10}$/),
  address: stringType().trim().min(5).max(300),
  city: stringType().trim().min(2).max(80),
  state: stringType().trim().min(2).max(80),
  pincode: stringType().trim().regex(/^[0-9]{6}$/)
});
const getCustomerOrderDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("7037d5f06b2e9419a4485e0e134077d4fd26a265feaa086f50b8baaa40ba2457"));
const placeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => checkoutSchema.parse(input)).handler(createSsrRpc("a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a"));
const payForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  gatewayOrderId: stringType().min(6),
  gatewayPaymentId: stringType().min(6).optional(),
  signature: stringType().min(10).optional()
}).parse(input)).handler(createSsrRpc("368d0f429b57d16396378ed4fe033f1b91e7e9533b1aeaeb80f9f8ac75dcc904"));
export {
  payForOrder as a,
  getCustomerOrderDetail as g,
  placeOrder as p
};
