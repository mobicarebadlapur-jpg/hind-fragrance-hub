import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-DN3Pp-JT.mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PublicLayout } from "./PublicLayout-DNCcDc1W.mjs";
import { u as useSession, B as Button } from "./SiteHeader-t5CpO3pB.mjs";
import { I as Input } from "./input-CfgHp7Je.mjs";
import { L as Label } from "./label-C-g-sDNu.mjs";
import { r as referralUrl } from "./router-BfVb2A60.mjs";
import { c as createServerFn } from "./server-dt98x2q-.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BYHyo-go.mjs";
import { e as ensureProfile } from "./account.functions-CFHeoWc3.mjs";
import "../_libs/seroval.mjs";
import { e as Check, f as Copy } from "../_libs/lucide-react.mjs";
import { s as stringType, o as objectType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const mobileSchema = objectType({
  mobile: stringType().trim().regex(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number")
});
const sendOtp = createServerFn({
  method: "POST"
}).inputValidator((input) => mobileSchema.parse(input)).handler(createSsrRpc("d3b911c10f37cf5763c36d5f8e080ea42c2592fdc270da223651f7f8c2732fbf"));
const verifyOtp = createServerFn({
  method: "POST"
}).inputValidator((input) => mobileSchema.extend({
  code: stringType().trim().length(6)
}).parse(input)).handler(createSsrRpc("a41441e847287c5ee4b65776a9ee9358c2a43c751710cdf47f6ce3ae4ab5e579"));
const createMembershipOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d25930c2709306e3e634dc6619e8b26d3a71ba47c939c3ee7e587f3338ae35ed"));
const verifyMembershipPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  gatewayOrderId: stringType().min(6),
  gatewayPaymentId: stringType().optional(),
  signature: stringType().optional()
}).parse(input)).handler(createSsrRpc("b7366b80948f3bf2209a8c76486a7800537c2af2480abeb6b6eaf35e10c34d8e"));
function Join() {
  const {
    data: session,
    isPending
  } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestOtp = useServerFn(sendOtp);
  const checkOtp = useServerFn(verifyOtp);
  const startPayment = useServerFn(createMembershipOrder);
  const confirmPayment = useServerFn(verifyMembershipPayment);
  const saveProfile = useServerFn(ensureProfile);
  const [step, setStep] = reactExports.useState(1);
  const [fullName, setFullName] = reactExports.useState("");
  const [mobile, setMobile] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [hint, setHint] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  if (!isPending && !session?.userId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "Sign in to continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Create your Hind Fragrance account first, then complete the ₹199 partner registration." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", onClick: () => navigate({
        to: "/auth",
        search: {
          redirect: "/join",
          mode: "signup"
        }
      }), children: "Create account" })
    ] }) });
  }
  if (session?.partner?.status === "active" && !result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "You're already a partner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "Partner ID ",
        session.partner.partner_code
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/partner", children: "Open dashboard" }) })
    ] }) });
  }
  async function handleSendOtp() {
    setBusy(true);
    try {
      const res = await requestOtp({
        data: {
          mobile
        }
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setHint(res.demoCode ? `Demo mode: your OTP is ${res.demoCode}` : null);
      setStep(2);
      toast.success("OTP sent to your mobile.");
    } catch {
      toast.error("Enter a valid 10 digit mobile number.");
    } finally {
      setBusy(false);
    }
  }
  async function handleVerify() {
    setBusy(true);
    try {
      const res = await checkOtp({
        data: {
          mobile,
          code
        }
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      await saveProfile({
        data: {
          full_name: fullName,
          mobile
        }
      });
      setStep(3);
    } catch {
      toast.error("Enter the 6 digit code.");
    } finally {
      setBusy(false);
    }
  }
  async function handlePay() {
    setBusy(true);
    try {
      const order = await startPayment({});
      if (!order.ok) {
        toast.error(order.error);
        return;
      }
      const verified = await confirmPayment({
        data: {
          gatewayOrderId: order.gatewayOrderId
        }
      });
      if (!verified.ok) {
        toast.error(verified.error);
        return;
      }
      setResult({
        partnerCode: verified.partnerCode,
        referralCode: verified.referralCode
      });
      await queryClient.invalidateQueries({
        queryKey: ["session"]
      });
      toast.success("Membership activated!");
    } finally {
      setBusy(false);
    }
  }
  if (result) {
    const link = referralUrl(result.referralCode);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-6 w-6 text-gold" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-4xl", children: "Welcome, partner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "Your Partner ID is",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: result.partnerCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-border bg-card p-4 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", children: "Your referral link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate rounded-md bg-secondary px-3 py-2 text-xs", children: link }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => {
            void navigator.clipboard.writeText(link);
            toast.success("Referral link copied");
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-8", size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/partner", children: "Open my dashboard" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "eyebrow", children: [
      "Step ",
      step,
      " of 3"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl", children: "Business Partner registration" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border border-border bg-card p-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: fullName, onChange: (e) => setFullName(e.target.value), maxLength: 100 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mobile", children: "Mobile number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mobile", inputMode: "numeric", value: mobile, onChange: (e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)), placeholder: "10 digit mobile" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: handleSendOtp, disabled: busy || mobile.length !== 10 || fullName.trim().length < 2, children: busy ? "Sending…" : "Send OTP" })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Enter the 6 digit code sent to ",
          mobile,
          "."
        ] }),
        hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md bg-secondary p-3 text-xs", children: hint }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "numeric", value: code, onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)), placeholder: "••••••", className: "text-center tracking-[0.5em]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: handleVerify, disabled: busy || code.length !== 6, children: busy ? "Verifying…" : "Verify mobile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full text-xs text-muted-foreground underline underline-offset-4", onClick: handleSendOtp, disabled: busy, children: "Resend OTP" })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between border-b border-border pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Business Partner Membership" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl", children: "₹199" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Unique Partner ID and referral link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Live earnings, clicks and orders dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bank / UPI payouts once approved" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", size: "lg", onClick: handlePay, disabled: busy, children: busy ? "Processing…" : "Pay ₹199 and activate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "One-time, non-refundable registration fee. Commission is earned on eligible product sales only." })
      ] })
    ] })
  ] }) });
}
export {
  Join as component
};
