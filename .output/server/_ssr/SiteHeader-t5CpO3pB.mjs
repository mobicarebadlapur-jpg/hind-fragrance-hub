import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { u as useCart, s as supabase } from "./router-BfVb2A60.mjs";
import { b as ShoppingBag, X, M as Menu } from "../_libs/lucide-react.mjs";
function Logo({ inverted = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `flex h-9 w-9 items-center justify-center rounded-full border ${inverted ? "border-gold/60" : "border-gold"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg leading-none text-gold", children: "HF" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `block font-display text-lg font-semibold ${inverted ? "text-ink-foreground" : "text-foreground"}`,
          children: "Hind Fragrance"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow block", children: "Alcohol-free attars" })
    ] })
  ] });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gold text-ink shadow-sm hover:bg-gold/90",
        "gold-outline": "border border-gold/70 text-gold bg-transparent hover:bg-gold/10",
        "ghost-inverted": "text-ink-foreground hover:bg-white/10"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
async function loadSession() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { userId: null, email: null, roles: [], profile: null, partner: null };
  const [roles, profile, partner] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("partners").select("*").eq("user_id", user.id).maybeSingle()
  ]);
  return {
    userId: user.id,
    email: user.email ?? null,
    roles: (roles.data ?? []).map((r) => r.role),
    profile: profile.data ?? null,
    partner: partner.data ?? null
  };
}
function useSession() {
  return useQuery({ queryKey: ["session"], queryFn: loadSession, staleTime: 15e3 });
}
function useIsAdmin() {
  const { data } = useSession();
  return Boolean(data?.roles.includes("admin"));
}
const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/business-partner", label: "Business Partner" }
];
function SiteHeader() {
  const { count } = useCart();
  const { data: session } = useSession();
  const [open, setOpen] = reactExports.useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = session?.roles.includes("admin");
  const isPartner = Boolean(session?.partner);
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-8 md:flex", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.to,
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-foreground font-medium" },
          activeOptions: { exact: link.to === "/" },
          children: link.label
        },
        link.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative p-2", "aria-label": "Cart", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink", children: count })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden items-center gap-2 md:flex", children: session?.userId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: "Admin" }) }),
          isPartner && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/partner", children: "Dashboard" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", children: "Account" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: signOut, children: "Sign out" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Login" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Join for ₹199" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "p-2 md:hidden",
            onClick: () => setOpen((v) => !v),
            "aria-label": "Toggle menu",
            children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-background px-4 py-3 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.to,
          onClick: () => setOpen(false),
          className: "rounded-md px-2 py-2 text-sm",
          children: link.label
        },
        link.to
      )),
      session?.userId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", onClick: () => setOpen(false), className: "px-2 py-2 text-sm", children: "Admin panel" }),
        isPartner && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/partner", onClick: () => setOpen(false), className: "px-2 py-2 text-sm", children: "Partner dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", onClick: () => setOpen(false), className: "px-2 py-2 text-sm", children: "My account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "mt-2", onClick: signOut, children: "Sign out" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Login" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/join", children: "Join ₹199" }) })
      ] })
    ] }) })
  ] });
}
export {
  Button as B,
  Logo as L,
  SiteHeader as S,
  useIsAdmin as a,
  cn as c,
  useSession as u
};
