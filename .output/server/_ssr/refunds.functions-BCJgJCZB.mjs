import { c as createSsrRpc } from "./createSsrRpc-DMPreFkr.mjs";
import { c as createServerFn } from "./server-aKsQTMQw.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cs6le4K7.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const refundReason = stringType().trim().min(5).max(500);
const requestOrderCancellationOrRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  reason: refundReason
}).parse(input)).handler(createSsrRpc("16474e78f6807b083f980469f884214f2fe6c8a404103fa0902f7caa6861e470"));
const listAdminRefundRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c0b70df35af73b70ce7d75495b27e5e0e2836e33e902697535a3ed7df3835418"));
const processAdminRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid(),
  decision: enumType(["approved", "rejected"]),
  note: stringType().trim().max(300).optional().nullable()
}).parse(input)).handler(createSsrRpc("a458bf7ad354cb6de1aa4cd733b574332bb8a41c54f6c9a1d36a6ff9bace03ec"));
export {
  listAdminRefundRequests as l,
  processAdminRefund as p,
  requestOrderCancellationOrRefund as r
};
