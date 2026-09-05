import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-DN3Pp-JT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PublicLayout } from "./PublicLayout-DNCcDc1W.mjs";
import { u as useSession, B as Button } from "./SiteHeader-t5CpO3pB.mjs";
import { I as Input } from "./input-CfgHp7Je.mjs";
import { L as Label } from "./label-C-g-sDNu.mjs";
import { u as useCart, g as getReferralCode } from "./router-BfVb2A60.mjs";
import { i as inr } from "./format-BY29FUB1.mjs";
import { c as createServerFn } from "./server-dt98x2q-.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BYHyo-go.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
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
const checkoutSchema = objectType({
  items: arrayType(objectType({
    productId: stringType().uuid(),
    quantity: numberType().int().min(1).max(20)
  })).min(1).max(30),
  referralCode: stringType().trim().max(32).optional().nullable(),
  shippingName: stringType().trim().min(2).max(100),
  mobile: stringType().trim().regex(/^[0-9]{10}$/),
  address: stringType().trim().min(5).max(300),
  city: stringType().trim().min(2).max(80),
  state: stringType().trim().min(2).max(80),
  pincode: stringType().trim().regex(/^[0-9]{6}$/)
});
const placeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => checkoutSchema.parse(input)).handler(createSsrRpc("a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a"));
const payForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("368d0f429b57d16396378ed4fe033f1b91e7e9533b1aeaeb80f9f8ac75dcc904"));
function Checkout() {
  const {
    items,
    subtotal,
    clear
  } = useCart();
  const {
    data: session,
    isPending
  } = useSession();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const pay = useServerFn(payForOrder);
  const [form, setForm] = reactExports.useState({
    shippingName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  const [placed, setPlaced] = reactExports.useState(null);
  const referral = typeof window !== "undefined" ? getReferralCode() : null;
  const shipping = subtotal >= 999 ? 0 : 59;
  reactExports.useEffect(() => {
    const profile = session?.profile;
    if (profile) setForm((f) => ({
      shippingName: f.shippingName || (profile.full_name ?? ""),
      mobile: f.mobile || (profile.mobile ?? ""),
      address: f.address || (profile.address ?? ""),
      city: f.city || (profile.city ?? ""),
      state: f.state || (profile.state ?? ""),
      pincode: f.pincode || (profile.pincode ?? "")
    }));
  }, [session?.profile]);
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await submitOrder({
        data: {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity
          })),
          referralCode: referral,
          ...form
        }
      });
      if (!created.ok) {
        toast.error(created.error);
        return;
      }
      const paid = await pay({
        data: {
          orderId: created.orderId
        }
      });
      if (!paid.ok) {
        toast.error(paid.error);
        return;
      }
      clear();
      setPlaced({
        orderNumber: paid.orderNumber
      });
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (placed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "Order confirmed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "Your order ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: placed.orderNumber }),
        " has been placed. You'll receive updates as it ships."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", children: "View my orders" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: "Continue shopping" }) })
      ] })
    ] }) });
  }
  if (!isPending && !session?.userId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "Sign in to checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "You need an account so we can track and deliver your order." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", onClick: () => navigate({
        to: "/auth",
        search: {
          redirect: "/checkout"
        }
      }), children: "Sign in or create account" })
    ] }) });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: "Browse fragrances" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-[1fr_320px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "rounded-xl border border-border bg-card p-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl", children: "Checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Delivery details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", value: form.shippingName, onChange: (v) => setForm({
          ...form,
          shippingName: v
        }), maxLength: 100 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile (10 digits)", value: form.mobile, onChange: (v) => setForm({
          ...form,
          mobile: v.replace(/\D/g, "").slice(0, 10)
        }), maxLength: 10 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", value: form.address, onChange: (v) => setForm({
          ...form,
          address: v
        }), maxLength: 300 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", value: form.city, onChange: (v) => setForm({
          ...form,
          city: v
        }), maxLength: 80 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State", value: form.state, onChange: (v) => setForm({
          ...form,
          state: v
        }), maxLength: 80 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Pincode", value: form.pincode, onChange: (v) => setForm({
          ...form,
          pincode: v.replace(/\D/g, "").slice(0, 6)
        }), maxLength: 6 })
      ] }),
      referral && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground", children: [
        "Referral code ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: referral }),
        " will be applied to this order."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", className: "mt-6 w-full", disabled: busy, children: busy ? "Processing payment…" : `Pay ${inr(subtotal + shipping)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: "Payments are verified server-side. Demo mode simulates the gateway until live keys are added." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "h-fit rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Order summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3 text-sm", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          item.name,
          " × ",
          item.quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inr(item.price * item.quantity) })
      ] }, item.productId)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 space-y-2 border-t border-border pt-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: inr(subtotal) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Shipping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: shipping === 0 ? "Free" : inr(shipping) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3 text-base font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: inr(subtotal + shipping) })
        ] })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  value,
  onChange,
  maxLength
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => onChange(e.target.value), maxLength, required: true })
  ] });
}
export {
  Checkout as component
};
