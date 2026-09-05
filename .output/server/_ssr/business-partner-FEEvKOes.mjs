import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PublicLayout } from "./PublicLayout-DNCcDc1W.mjs";
import { B as Button, c as cn } from "./SiteHeader-t5CpO3pB.mjs";
import { R as Root2, I as Item, H as Header, T as Trigger2, C as Content2 } from "../_libs/radix-ui__react-accordion.mjs";
import { s as supabase } from "./router-BfVb2A60.mjs";
import "../_libs/sonner.mjs";
import { a as ShieldCheck, c as Link2, C as ChartColumn, W as Wallet, d as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger2,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = Content2.displayName;
function BusinessPartner() {
  const {
    data: settings
  } = useQuery({
    queryKey: ["public-settings"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("app_settings").select("key,value").in("key", ["membership", "commission"]);
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      return {
        price: Number(map["membership"]?.["price"] ?? 199),
        percent: Number(map["commission"]?.["default_percent"] ?? 10),
        minPayout: Number(map["commission"]?.["min_payout"] ?? 500),
        holding: Number(map["commission"]?.["holding_days"] ?? 7)
      };
    }
  });
  const price = settings?.price ?? 199;
  const percent = settings?.percent ?? 10;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-ink", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow text-gold", children: "Referral sales programme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-5xl text-ink-foreground md:text-6xl", children: "Become a Hind Fragrance Business Partner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mx-auto mt-5 max-w-2xl text-ink-foreground/70", children: [
        "A one-time ₹",
        price,
        " registration gets you a Partner ID, a personal referral link and a dashboard that tracks every click, order and rupee you earn. Commission is paid on eligible product sales only — there is no recruitment income and no guaranteed returns."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "gold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/join", children: [
          "Join for ₹",
          price
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "ghost-inverted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: "See the products" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "How it works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-4xl", children: "Four simple steps" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-8 grid gap-6 md:grid-cols-4", children: [{
        icon: ShieldCheck,
        title: "Register",
        body: `Sign up and pay the one-time ₹${price} membership fee.`
      }, {
        icon: Link2,
        title: "Get your link",
        body: "Receive your Partner ID and unique referral link instantly."
      }, {
        icon: ChartColumn,
        title: "Share & track",
        body: "Share with customers and watch clicks and orders live."
      }, {
        icon: Wallet,
        title: "Get paid",
        body: `Earn ${percent}% commission and withdraw to bank or UPI.`
      }].map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "eyebrow", children: [
          "Step ",
          index + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { className: "mt-3 h-5 w-5 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-xl", children: step.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: step.body })
      ] }, step.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-4 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-3", children: [{
      label: "Membership fee",
      value: `₹${price} once`
    }, {
      label: "Default commission",
      value: `${percent}% per eligible sale`
    }, {
      label: "Minimum payout",
      value: `₹${settings?.minPayout ?? 500}`
    }].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", children: stat.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display text-3xl", children: stat.value })
    ] }, stat.label)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "Questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-4xl", children: "Programme FAQ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion, { type: "single", collapsible: true, className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "How is commission calculated?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { children: [
            "Commission is a percentage of the product subtotal only — shipping, taxes and discounts are excluded. Individual products may carry their own commission rate, which overrides the default ",
            percent,
            "%."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "When does my commission become withdrawable?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { children: [
            "A commission is created when the referred order is paid, and becomes approved after a",
            " ",
            settings?.holding ?? 7,
            "-day holding period covering returns. Cancelled or refunded orders reverse the commission automatically."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Can I earn from my own purchases?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: "No. Self-referral is blocked server-side — using your own referral link on your own order will not generate commission." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Is this an investment or an income scheme?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: "No. This is a referral sales programme. There is no guaranteed income, no returns on the membership fee, and no earnings from recruiting other partners." })
        ] })
      ] })
    ] })
  ] });
}
export {
  BusinessPartner as component
};
