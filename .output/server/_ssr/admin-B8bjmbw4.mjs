import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-DMPreFkr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DashboardShell, E as EmptyState, S as StatusPill } from "./DashboardShell-CDdOn0xK.mjs";
import { a as useIsAdmin, u as useSession, B as Button } from "./SiteHeader-jDQ4_J-a.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-ifAKAjMD.mjs";
import { u as updateOrderStatus, a as updatePartnerStatus, b as upsertProduct, l as listAdminPartners, c as listAdminProducts, d as listAdminOrders } from "./admin.functions-Ga6eB7B3.mjs";
import "../_libs/seroval.mjs";
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
import "./server-aKsQTMQw.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./format-BY29FUB1.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-BNTsyRpR.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "./auth-middleware-Cs6le4K7.mjs";
const ORDER_STATUSES = ["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];
const EMPTY_PRODUCT = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  short_description: "",
  description: "",
  image_url: "",
  price: "",
  sale_price: "",
  stock: "0",
  commission_percent: "0",
  featured: false,
  status: "draft"
};
function AdminConsole() {
  const isAdmin = useIsAdmin();
  const {
    data: session
  } = useSession();
  const queryClient = useQueryClient();
  const listPartners = useServerFn(listAdminPartners);
  const updatePartner = useServerFn(updatePartnerStatus);
  const listProducts = useServerFn(listAdminProducts);
  const saveProduct = useServerFn(upsertProduct);
  const listOrders = useServerFn(listAdminOrders);
  const updateOrder = useServerFn(updateOrderStatus);
  const [busyId, setBusyId] = reactExports.useState(null);
  const [productBusy, setProductBusy] = reactExports.useState(false);
  const [orderBusy, setOrderBusy] = reactExports.useState(null);
  const [orderFilter, setOrderFilter] = reactExports.useState("all");
  const [orderSearch, setOrderSearch] = reactExports.useState("");
  const [productForm, setProductForm] = reactExports.useState(EMPTY_PRODUCT);
  const partnersQuery = useQuery({
    queryKey: ["admin-partners"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await listPartners();
      if (!result.ok) throw new Error(result.error);
      return result.partners;
    }
  });
  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await listProducts();
      if (!result.ok) throw new Error(result.error);
      return result.products;
    }
  });
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await listOrders();
      if (!result.ok) throw new Error(result.error);
      return result.orders;
    }
  });
  const filteredOrders = reactExports.useMemo(() => {
    const search = orderSearch.trim().toLowerCase();
    return (ordersQuery.data ?? []).filter((order) => {
      const matchesStatus = orderFilter === "all" || order.status === orderFilter;
      const matchesSearch = !search || order.order_number.toLowerCase().includes(search) || (order.referral_code ?? "").toLowerCase().includes(search) || (order.shipping_name ?? "").toLowerCase().includes(search) || (order.mobile ?? "").includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [ordersQuery.data, orderFilter, orderSearch]);
  async function changePartnerStatus(partnerId, status) {
    setBusyId(partnerId);
    try {
      const result = await updatePartner({
        data: {
          partnerId,
          status
        }
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Partner marked ${status}.`);
      await queryClient.invalidateQueries({
        queryKey: ["admin-partners"]
      });
      await queryClient.invalidateQueries({
        queryKey: ["session"]
      });
    } catch {
      toast.error("Could not update partner status.");
    } finally {
      setBusyId(null);
    }
  }
  async function changeOrderStatus(orderId, status) {
    setOrderBusy(orderId);
    try {
      const result = await updateOrder({
        data: {
          orderId,
          status
        }
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Order marked ${status.replace("_", " ")}.`);
      await queryClient.invalidateQueries({
        queryKey: ["admin-orders"]
      });
    } catch {
      toast.error("Could not update order status.");
    } finally {
      setOrderBusy(null);
    }
  }
  function editProduct(product) {
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      short_description: product.short_description ?? "",
      description: product.description ?? "",
      image_url: product.image_url ?? "",
      price: String(product.price),
      sale_price: product.sale_price == null ? "" : String(product.sale_price),
      stock: String(product.stock),
      commission_percent: product.commission_percent == null ? "0" : String(product.commission_percent),
      featured: product.featured,
      status: product.status
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  function setField(key, value) {
    setProductForm((current) => ({
      ...current,
      [key]: value
    }));
  }
  async function saveCurrentProduct() {
    setProductBusy(true);
    try {
      const result = await saveProduct({
        data: {
          id: productForm.id,
          name: productForm.name,
          slug: productForm.slug,
          sku: productForm.sku,
          category: productForm.category,
          short_description: productForm.short_description || null,
          description: productForm.description || null,
          image_url: productForm.image_url || null,
          price: Number(productForm.price),
          sale_price: productForm.sale_price === "" ? null : Number(productForm.sale_price),
          stock: Number(productForm.stock),
          commission_percent: productForm.commission_percent === "" ? null : Number(productForm.commission_percent),
          featured: productForm.featured,
          status: productForm.status
        }
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(productForm.id ? "Product updated." : "Product created.");
      setProductForm(EMPTY_PRODUCT);
      await queryClient.invalidateQueries({
        queryKey: ["admin-products"]
      });
    } catch {
      toast.error("Could not save product.");
    } finally {
      setProductBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { title: "Admin Console", subtitle: session?.email ?? "", children: !isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "You do not have permission to access the admin console." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin-refunds", children: "Refund requests" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "orders", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "partners", children: "Partners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "products", children: "Products" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "orders", className: "mt-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Track payments, fulfilment, customer delivery details and commissions." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void ordersQuery.refetch(), disabled: ordersQuery.isFetching, children: "Refresh" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-[1fr_220px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": "Search orders", placeholder: "Search order, customer, mobile or referral…", className: "rounded-md border bg-background px-3 py-2 text-sm", value: orderSearch, onChange: (e) => setOrderSearch(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { "aria-label": "Filter orders by status", className: "rounded-md border bg-background px-3 py-2 text-sm", value: orderFilter, onChange: (e) => setOrderFilter(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All statuses" }),
            ORDER_STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status.replace("_", " ") }, status))
          ] })
        ] }),
        ordersQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading orders…" }) : ordersQuery.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Could not load orders." }) : filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No matching orders." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredOrders.map((order) => {
          const items = order.order_items ?? [];
          const commissions = order.commissions ?? [];
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.order_number }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: order.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(order.created_at).toLocaleString("en-IN") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Customer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.shipping_name || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: order.mobile || order.customer_id })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Payment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.payment_id || "Awaiting payment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Total ₹",
                    Number(order.total).toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Referral" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.referral_code || "Direct" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Partner ",
                    order.partner_id ? "linked" : "none"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Delivery" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    order.city || "—",
                    order.state ? `, ${order.state}` : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: order.pincode || "" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: order.address || "No address supplied" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Items" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-1 text-sm", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    item.product_name,
                    " × ",
                    item.quantity
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "₹",
                    Number(item.line_total).toLocaleString("en-IN")
                  ] })
                ] }, item.id)) })
              ] }),
              commissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
                "Commission: ₹",
                commissions.reduce((sum, item) => sum + Number(item.amount), 0).toLocaleString("en-IN"),
                " · ",
                commissions.map((item) => item.status).join(", ")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-[190px] flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { "aria-label": `Update ${order.order_number} status`, className: "rounded-md border bg-background px-3 py-2 text-sm", value: order.status, disabled: orderBusy === order.id, onChange: (e) => void changeOrderStatus(order.id, e.target.value), children: ORDER_STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status.replace("_", " ") }, status)) }),
              orderBusy === order.id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Updating…" })
            ] })
          ] }) }, order.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "partners", className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Partner applications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Approve pending applications to activate partner referral access." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void partnersQuery.refetch(), disabled: partnersQuery.isFetching, children: "Refresh" })
        ] }),
        partnersQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading partners…" }) : partnersQuery.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Could not load partner applications." }) : partnersQuery.data?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No partner applications yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: partnersQuery.data?.map((partner) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: partner.partner_code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: partner.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
              "User: ",
              partner.user_id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              "Referral: ",
              partner.referral_code,
              " · Joined ",
              new Date(partner.joined_at).toLocaleDateString("en-IN")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            partner.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => void changePartnerStatus(partner.id, "active"), disabled: busyId === partner.id, children: busyId === partner.id ? "Updating…" : "Approve" }),
            partner.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => void changePartnerStatus(partner.id, "suspended"), disabled: busyId === partner.id, children: "Suspend" }),
            (partner.status === "pending" || partner.status === "suspended") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => void changePartnerStatus(partner.id, "cancelled"), disabled: busyId === partner.id, children: "Cancel" }),
            partner.status === "suspended" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => void changePartnerStatus(partner.id, "active"), disabled: busyId === partner.id, children: "Reactivate" })
          ] })
        ] }) }, partner.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "products", className: "mt-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Product catalogue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage prices, stock, commission, images and storefront visibility." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            productForm.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setProductForm(EMPTY_PRODUCT), children: "New product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void productsQuery.refetch(), disabled: productsQuery.isFetching, children: "Refresh" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: productForm.id ? "Edit product" : "Add product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Name",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.name, onChange: (e) => setField("name", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "SKU",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.sku, onChange: (e) => setField("sku", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Slug",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.slug, onChange: (e) => setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Category",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.category, onChange: (e) => setField("category", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Price (₹)",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.price, onChange: (e) => setField("price", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Sale price (₹)",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.sale_price, onChange: (e) => setField("sale_price", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Stock",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "1", className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.stock, onChange: (e) => setField("stock", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Commission %",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", step: "0.01", className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.commission_percent, onChange: (e) => setField("commission_percent", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
              "Status",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.status, onChange: (e) => setField("status", e.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Draft" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "archived", children: "Archived" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm md:col-span-2 lg:col-span-3", children: [
              "Image URL",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.image_url, onChange: (e) => setField("image_url", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm md:col-span-2 lg:col-span-3", children: [
              "Short description",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.short_description, onChange: (e) => setField("short_description", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm md:col-span-2 lg:col-span-3", children: [
              "Description",
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: "mt-1 w-full rounded-md border bg-background px-3 py-2", value: productForm.description, onChange: (e) => setField("description", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: productForm.featured, onChange: (e) => setField("featured", e.target.checked) }),
              " Featured product"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => void saveCurrentProduct(), disabled: productBusy, children: productBusy ? "Saving…" : productForm.id ? "Update product" : "Create product" }),
            productForm.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setProductForm(EMPTY_PRODUCT), children: "Cancel edit" })
          ] })
        ] }),
        productsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading products…" }) : productsQuery.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Could not load products." }) : productsQuery.data?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No products yet. Add the first product above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: productsQuery.data?.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 gap-4", children: [
            product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: "", className: "h-16 w-16 rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-lg border bg-muted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: product.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                product.sku,
                " · ",
                product.category,
                " · Stock ",
                product.stock
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm", children: [
                "₹",
                Number(product.sale_price ?? product.price).toLocaleString("en-IN"),
                " ",
                product.sale_price != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground line-through", children: [
                  "₹",
                  Number(product.price).toLocaleString("en-IN")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                "Commission ",
                Number(product.commission_percent ?? 0),
                "%",
                product.featured ? " · Featured" : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => editProduct(product), children: "Edit" })
        ] }) }, product.id)) })
      ] })
    ] })
  ] }) });
}
export {
  AdminConsole as component
};
