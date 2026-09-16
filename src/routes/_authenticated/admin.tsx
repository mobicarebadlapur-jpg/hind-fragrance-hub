import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/session";
import {
  listAdminPartners,
  listAdminProducts,
  listAdminOrders,
  updatePartnerStatus,
  updateOrderStatus,
  upsertProduct,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth", search: { redirect: "/admin" } });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (profile?.role !== "admin") throw redirect({ to: "/account" });
  },
  head: () => ({ meta: [
    { title: "Admin Console — Hind Fragrance" },
    { name: "description", content: "Manage Hind Fragrance partners, products and orders." },
  ] }),
  component: AdminConsole,
});

const PARTNER_STATUSES = ["pending", "active", "suspended", "cancelled"] as const;
type PartnerStatus = (typeof PARTNER_STATUSES)[number];
const ORDER_STATUSES = ["created", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const EMPTY_PRODUCT = {
  name: "", slug: "", sku: "", category: "", short_description: "", description: "", image_url: "",
  price: "", sale_price: "", stock: "0", commission_percent: "0", featured: false,
  status: "draft" as "active" | "draft" | "archived",
};
type ProductForm = typeof EMPTY_PRODUCT & { id?: string };

function AdminConsole() {
  const isAdmin = useIsAdmin();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const listPartners = useServerFn(listAdminPartners);
  const updatePartner = useServerFn(updatePartnerStatus);
  const listProducts = useServerFn(listAdminProducts);
  const saveProduct = useServerFn(upsertProduct);
  const listOrders = useServerFn(listAdminOrders);
  const updateOrder = useServerFn(updateOrderStatus);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [productBusy, setProductBusy] = useState(false);
  const [orderBusy, setOrderBusy] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);

  const partnersQuery = useQuery({ queryKey: ["admin-partners"], enabled: isAdmin, queryFn: async () => {
    const result = await listPartners(); if (!result.ok) throw new Error(result.error); return result.partners;
  }});
  const productsQuery = useQuery({ queryKey: ["admin-products"], enabled: isAdmin, queryFn: async () => {
    const result = await listProducts(); if (!result.ok) throw new Error(result.error); return result.products;
  }});
  const ordersQuery = useQuery({ queryKey: ["admin-orders"], enabled: isAdmin, queryFn: async () => {
    const result = await listOrders(); if (!result.ok) throw new Error(result.error); return result.orders;
  }});

  const filteredOrders = useMemo(() => {
    const search = orderSearch.trim().toLowerCase();
    return (ordersQuery.data ?? []).filter((order) => {
      const matchesStatus = orderFilter === "all" || order.status === orderFilter;
      const matchesSearch = !search || order.order_number.toLowerCase().includes(search) || (order.referral_code ?? "").toLowerCase().includes(search) || (order.shipping_name ?? "").toLowerCase().includes(search) || (order.mobile ?? "").includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [ordersQuery.data, orderFilter, orderSearch]);

  async function changePartnerStatus(partnerId: string, status: PartnerStatus) {
    setBusyId(partnerId);
    try {
      const result = await updatePartner({ data: { partnerId, status } });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(`Partner marked ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    } catch { toast.error("Could not update partner status."); }
    finally { setBusyId(null); }
  }

  async function changeOrderStatus(orderId: string, status: OrderStatus) {
    setOrderBusy(orderId);
    try {
      const result = await updateOrder({ data: { orderId, status } });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(`Order marked ${status.replace("_", " ")}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch { toast.error("Could not update order status."); }
    finally { setOrderBusy(null); }
  }

  function editProduct(product: NonNullable<typeof productsQuery.data>[number]) {
    setProductForm({ id: product.id, name: product.name, slug: product.slug, sku: product.sku, category: product.category,
      short_description: product.short_description ?? "", description: product.description ?? "", image_url: product.image_url ?? "",
      price: String(product.price), sale_price: product.sale_price == null ? "" : String(product.sale_price), stock: String(product.stock),
      commission_percent: product.commission_percent == null ? "0" : String(product.commission_percent), featured: product.featured,
      status: product.status as ProductForm["status"] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function setField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) { setProductForm((current) => ({ ...current, [key]: value })); }
  async function saveCurrentProduct() {
    setProductBusy(true);
    try {
      const result = await saveProduct({ data: { id: productForm.id, name: productForm.name, slug: productForm.slug, sku: productForm.sku, category: productForm.category,
        short_description: productForm.short_description || null, description: productForm.description || null, image_url: productForm.image_url || null,
        price: Number(productForm.price), sale_price: productForm.sale_price === "" ? null : Number(productForm.sale_price), stock: Number(productForm.stock),
        commission_percent: productForm.commission_percent === "" ? null : Number(productForm.commission_percent), featured: productForm.featured, status: productForm.status } });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(productForm.id ? "Product updated." : "Product created."); setProductForm(EMPTY_PRODUCT);
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch { toast.error("Could not save product."); } finally { setProductBusy(false); }
  }

  return <DashboardShell title="Admin Console" subtitle={session?.email ?? ""}>
    {!isAdmin ? <EmptyState message="You do not have permission to access the admin console." /> : <>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="outline" size="sm"><Link to="/admin-refunds">Refund requests</Link></Button>
      </div>
      <Tabs defaultValue="orders">
      <TabsList><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="partners">Partners</TabsTrigger><TabsTrigger value="products">Products</TabsTrigger></TabsList>

      <TabsContent value="orders" className="mt-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="font-display text-2xl">Orders</h2><p className="mt-1 text-sm text-muted-foreground">Track payments, fulfilment, customer delivery details and commissions.</p></div>
          <Button variant="outline" size="sm" onClick={() => void ordersQuery.refetch()} disabled={ordersQuery.isFetching}>Refresh</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input aria-label="Search orders" placeholder="Search order, customer, mobile or referral…" className="rounded-md border bg-background px-3 py-2 text-sm" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
          <select aria-label="Filter orders by status" className="rounded-md border bg-background px-3 py-2 text-sm" value={orderFilter} onChange={(e) => setOrderFilter(e.target.value as "all" | OrderStatus)}>
            <option value="all">All statuses</option>{ORDER_STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
          </select>
        </div>
        {ordersQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading orders…</p> : ordersQuery.error ? <EmptyState message="Could not load orders." /> : filteredOrders.length === 0 ? <EmptyState message="No matching orders." /> :
          <div className="space-y-3">{filteredOrders.map((order) => {
            const items = (order.order_items ?? []) as Array<{ id: string; product_name: string; quantity: number; unit_price: number; line_total: number }>;
            const commissions = (order.commissions ?? []) as Array<{ id: string; amount: number; status: string }>;
            return <div key={order.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3"><span className="font-medium">{order.order_number}</span><StatusPill status={order.status} /><span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("en-IN")}</span></div>
                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
                    <div><p className="text-xs text-muted-foreground">Customer</p><p>{order.shipping_name || "—"}</p><p className="text-xs text-muted-foreground">{order.mobile || order.customer_id}</p></div>
                    <div><p className="text-xs text-muted-foreground">Payment</p><p>{order.payment_id || "Awaiting payment"}</p><p className="text-xs text-muted-foreground">Total ₹{Number(order.total).toLocaleString("en-IN")}</p></div>
                    <div><p className="text-xs text-muted-foreground">Referral</p><p>{order.referral_code || "Direct"}</p><p className="text-xs text-muted-foreground">Partner {order.partner_id ? "linked" : "none"}</p></div>
                    <div><p className="text-xs text-muted-foreground">Delivery</p><p>{order.city || "—"}{order.state ? `, ${order.state}` : ""}</p><p className="text-xs text-muted-foreground">{order.pincode || ""}</p></div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{order.address || "No address supplied"}</p>
                  <div className="mt-4 border-t pt-3"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items</p><div className="mt-2 space-y-1 text-sm">{items.map((item) => <div key={item.id} className="flex justify-between gap-3"><span>{item.product_name} × {item.quantity}</span><span>₹{Number(item.line_total).toLocaleString("en-IN")}</span></div>)}</div></div>
                  {commissions.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Commission: ₹{commissions.reduce((sum, item) => sum + Number(item.amount), 0).toLocaleString("en-IN")} · {commissions.map((item) => item.status).join(", ")}</p>}
                </div>
                <div className="flex min-w-[190px] flex-col gap-2">
                  <select aria-label={`Update ${order.order_number} status`} className="rounded-md border bg-background px-3 py-2 text-sm" value={order.status} disabled={orderBusy === order.id} onChange={(e) => void changeOrderStatus(order.id, e.target.value as OrderStatus)}>
                    {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                  </select>
                  {orderBusy === order.id && <p className="text-xs text-muted-foreground">Updating…</p>}
                </div>
              </div>
            </div>;
          })}</div>}
      </TabsContent>

      <TabsContent value="partners" className="mt-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-2xl">Partner applications</h2><p className="mt-1 text-sm text-muted-foreground">Approve pending applications to activate partner referral access.</p></div><Button variant="outline" size="sm" onClick={() => void partnersQuery.refetch()} disabled={partnersQuery.isFetching}>Refresh</Button></div>
        {partnersQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading partners…</p> : partnersQuery.error ? <EmptyState message="Could not load partner applications." /> : partnersQuery.data?.length === 0 ? <EmptyState message="No partner applications yet." /> : <div className="space-y-3">{partnersQuery.data?.map((partner) => <div key={partner.id} className="rounded-xl border border-border bg-card p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><span className="font-medium">{partner.partner_code}</span><StatusPill status={partner.status} /></div><p className="mt-2 text-xs text-muted-foreground">User: {partner.user_id}</p><p className="mt-1 text-xs text-muted-foreground">Referral: {partner.referral_code} · Joined {new Date(partner.joined_at).toLocaleDateString("en-IN")}</p></div><div className="flex flex-wrap gap-2">{partner.status === "pending" && <Button size="sm" onClick={() => void changePartnerStatus(partner.id, "active")} disabled={busyId === partner.id}>{busyId === partner.id ? "Updating…" : "Approve"}</Button>}{partner.status === "active" && <Button size="sm" variant="outline" onClick={() => void changePartnerStatus(partner.id, "suspended")} disabled={busyId === partner.id}>Suspend</Button>}{(partner.status === "pending" || partner.status === "suspended") && <Button size="sm" variant="destructive" onClick={() => void changePartnerStatus(partner.id, "cancelled")} disabled={busyId === partner.id}>Cancel</Button>}{partner.status === "suspended" && <Button size="sm" onClick={() => void changePartnerStatus(partner.id, "active")} disabled={busyId === partner.id}>Reactivate</Button>}</div></div></div>)}</div>}
      </TabsContent>

      <TabsContent value="products" className="mt-6 space-y-6">
        <div className="flex items-center justify-between"><div><h2 className="font-display text-2xl">Product catalogue</h2><p className="mt-1 text-sm text-muted-foreground">Manage prices, stock, commission, images and storefront visibility.</p></div><div className="flex gap-2">{productForm.id && <Button variant="outline" size="sm" onClick={() => setProductForm(EMPTY_PRODUCT)}>New product</Button>}<Button variant="outline" size="sm" onClick={() => void productsQuery.refetch()} disabled={productsQuery.isFetching}>Refresh</Button></div></div>
        <div className="rounded-xl border border-border bg-card p-5"><h3 className="font-medium">{productForm.id ? "Edit product" : "Add product"}</h3><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">Name<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.name} onChange={(e) => setField("name", e.target.value)} /></label>
          <label className="text-sm">SKU<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.sku} onChange={(e) => setField("sku", e.target.value)} /></label>
          <label className="text-sm">Slug<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.slug} onChange={(e) => setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} /></label>
          <label className="text-sm">Category<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.category} onChange={(e) => setField("category", e.target.value)} /></label>
          <label className="text-sm">Price (₹)<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.price} onChange={(e) => setField("price", e.target.value)} /></label>
          <label className="text-sm">Sale price (₹)<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.sale_price} onChange={(e) => setField("sale_price", e.target.value)} /></label>
          <label className="text-sm">Stock<input type="number" min="0" step="1" className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.stock} onChange={(e) => setField("stock", e.target.value)} /></label>
          <label className="text-sm">Commission %<input type="number" min="0" max="100" step="0.01" className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.commission_percent} onChange={(e) => setField("commission_percent", e.target.value)} /></label>
          <label className="text-sm">Status<select className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.status} onChange={(e) => setField("status", e.target.value as ProductForm["status"])}><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
          <label className="text-sm md:col-span-2 lg:col-span-3">Image URL<input type="url" className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.image_url} onChange={(e) => setField("image_url", e.target.value)} /></label>
          <label className="text-sm md:col-span-2 lg:col-span-3">Short description<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.short_description} onChange={(e) => setField("short_description", e.target.value)} /></label>
          <label className="text-sm md:col-span-2 lg:col-span-3">Description<textarea rows={4} className="mt-1 w-full rounded-md border bg-background px-3 py-2" value={productForm.description} onChange={(e) => setField("description", e.target.value)} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.featured} onChange={(e) => setField("featured", e.target.checked)} /> Featured product</label>
        </div><div className="mt-5 flex gap-2"><Button onClick={() => void saveCurrentProduct()} disabled={productBusy}>{productBusy ? "Saving…" : productForm.id ? "Update product" : "Create product"}</Button>{productForm.id && <Button variant="outline" onClick={() => setProductForm(EMPTY_PRODUCT)}>Cancel edit</Button>}</div></div>
        {productsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading products…</p> : productsQuery.error ? <EmptyState message="Could not load products." /> : productsQuery.data?.length === 0 ? <EmptyState message="No products yet. Add the first product above." /> : <div className="space-y-3">{productsQuery.data?.map((product) => <div key={product.id} className="rounded-xl border border-border bg-card p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 gap-4">{product.image_url ? <img src={product.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <div className="h-16 w-16 rounded-lg border bg-muted" />}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-medium">{product.name}</span><StatusPill status={product.status} /></div><p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.category} · Stock {product.stock}</p><p className="mt-1 text-sm">₹{Number(product.sale_price ?? product.price).toLocaleString("en-IN")} {product.sale_price != null && <span className="ml-2 text-xs text-muted-foreground line-through">₹{Number(product.price).toLocaleString("en-IN")}</span>}</p><p className="mt-1 text-xs text-muted-foreground">Commission {Number(product.commission_percent ?? 0)}%{product.featured ? " · Featured" : ""}</p></div></div><Button size="sm" variant="outline" onClick={() => editProduct(product)}>Edit</Button></div></div>)}</div>}
      </TabsContent>
    </Tabs>
    </>}
  </DashboardShell>;
}
