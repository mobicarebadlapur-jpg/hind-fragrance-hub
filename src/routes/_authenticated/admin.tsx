import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";
import { DashboardShell, EmptyState, StatCard, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, inr, shortDate } from "@/lib/format";
import { useIsAdmin, useSession } from "@/lib/session";
import {
  setCustomerBlocked,
  updateCommissionStatus,
  updateOrderStatus,
  updatePartnerStatus,
  updatePayoutStatus,
  updateSetting,
  upsertProduct,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Hind Fragrance" },
      {
        name: "description",
        content: "Manage partners, orders, commissions, payouts and platform settings.",
      },
      { property: "og:title", content: "Admin Console — Hind Fragrance" },
      { property: "og:description", content: "Hind Fragrance operations control centre." },
    ],
  }),
  component: AdminConsole,
});

const ORDER_STATUSES = [
  "created",
  "payment_pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
] as const;
const PARTNER_STATUSES = ["pending", "payment_pending", "active", "suspended", "cancelled"] as const;
const COMMISSION_STATUSES = [
  "pending",
  "approved",
  "available",
  "paid",
  "cancelled",
  "reversed",
] as const;
const PAYOUT_STATUSES = [
  "requested",
  "under_review",
  "approved",
  "processing",
  "paid",
  "rejected",
] as const;

function AdminConsole() {
  const { isPending } = useSession();
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const saveSetting = useServerFn(updateSetting);
  const setPartner = useServerFn(updatePartnerStatus);
  const setOrder = useServerFn(updateOrderStatus);
  const setCommission = useServerFn(updateCommissionStatus);
  const setPayout = useServerFn(updatePayoutStatus);
  const setBlocked = useServerFn(setCustomerBlocked);
  const saveProduct = useServerFn(upsertProduct);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-data"],
    enabled: Boolean(isAdmin),
    queryFn: async () => {
      const [partners, orders, commissions, payouts, customers, settings, products, auditLogs] =
        await Promise.all([
          supabase.from("partners").select("*").order("created_at", { ascending: false }),
          supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false }),
          supabase
            .from("commissions")
            .select("*, partners(partner_code), orders(order_number)")
            .order("created_at", { ascending: false }),
          supabase
            .from("payouts")
            .select(
              "id,partner_id,amount,method,account_holder,bank_name,status,notes,created_at,updated_at,account_number_last4,upi_id_masked,ifsc_masked, partners(partner_code)",
            )
            .order("created_at", { ascending: false }),
          supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
          supabase.from("app_settings").select("*"),
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase
            .from("audit_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);
      return {
        partners: partners.data ?? [],
        orders: orders.data ?? [],
        commissions: commissions.data ?? [],
        payouts: payouts.data ?? [],
        customers: customers.data ?? [],
        settings: settings.data ?? [],
        products: products.data ?? [],
        auditLogs: auditLogs.data ?? [],
      };
    },
  });

  const commissionSetting = data?.settings.find((s) => s.key === "commission")?.value as
    | Record<string, unknown>
    | undefined;
  const membershipSetting = data?.settings.find((s) => s.key === "membership")?.value as
    | Record<string, unknown>
    | undefined;

  const [form, setForm] = useState({
    default_percent: "10",
    min_payout: "500",
    holding_days: "7",
    membership_price: "199",
  });

  useEffect(() => {
    if (!commissionSetting && !membershipSetting) return;
    setForm({
      default_percent: String(commissionSetting?.["default_percent"] ?? 10),
      min_payout: String(commissionSetting?.["min_payout"] ?? 500),
      holding_days: String(commissionSetting?.["holding_days"] ?? 7),
      membership_price: String(membershipSetting?.["price"] ?? 199),
    });
  }, [commissionSetting, membershipSetting]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-data"] });

  async function run(action: Promise<{ ok: boolean; error?: string }>, message: string) {
    try {
      const res = await action;
      if (!res.ok) {
        toast.error(res.error ?? "Action failed");
        return;
      }
      toast.success(message);
      await refresh();
    } catch {
      toast.error("Action failed. Please try again.");
    }
  }

  if (isPending) {
    return (
      <DashboardShell title="Admin console">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </DashboardShell>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardShell title="Admin console">
        <EmptyState message="You do not have access to the admin console." />
      </DashboardShell>
    );
  }

  const revenue = (data?.orders ?? [])
    .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((s, o) => s + Number(o.total), 0);
  const commissionTotal = (data?.commissions ?? [])
    .filter((c) => c.status !== "reversed")
    .reduce((s, c) => s + Number(c.amount), 0);

  return (
    <DashboardShell title="Admin console" subtitle="Operations, partners and platform settings">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Partners" value={data?.partners.length ?? 0} />
        <StatCard label="Orders" value={data?.orders.length ?? 0} />
        <StatCard label="Revenue" value={revenue} currency />
        <StatCard label="Commission payable" value={commissionTotal} currency />
      </div>

      <Tabs defaultValue="partners" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading data…</p>}

        <TabsContent value="partners" className="mt-6 space-y-3">
          {(data?.partners ?? []).length === 0 && <EmptyState message="No partners yet." />}
          {(data?.partners ?? []).map((p) => (
            <Row
              key={p.id}
              title={`${p.partner_code} · ${p.referral_code}`}
              meta={`Joined ${shortDate(p.created_at)}`}
              status={p.status}
              options={PARTNER_STATUSES}
              onChange={(status) =>
                run(
                  setPartner({ data: { partnerId: p.id, status: status as "active" } }),
                  "Partner updated",
                )
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="orders" className="mt-6 space-y-3">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsv(
                  "orders.csv",
                  (data?.orders ?? []).map((o) => ({
                    order: o.order_number,
                    total: o.total,
                    status: o.status,
                    date: o.created_at,
                  })),
                )
              }
            >
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          {(data?.orders ?? []).length === 0 && <EmptyState message="No orders yet." />}
          {(data?.orders ?? []).map((o) => (
            <Row
              key={o.id}
              title={`${o.order_number} · ${inr(o.total)}`}
              meta={`${o.referral_code ? `Ref ${o.referral_code} · ` : ""}${shortDate(o.created_at)}`}
              status={o.status}
              options={ORDER_STATUSES}
              onChange={(status) =>
                run(
                  setOrder({ data: { orderId: o.id, status: status as "paid" } }),
                  "Order updated",
                )
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="commissions" className="mt-6 space-y-3">
          {(data?.commissions ?? []).length === 0 && <EmptyState message="No commissions yet." />}
          {(data?.commissions ?? []).map((c) => (
            <Row
              key={c.id}
              title={`${inr(c.amount)} · ${c.percent}%`}
              meta={`${c.partners?.partner_code ?? ""} · ${c.orders?.order_number ?? ""}`}
              status={c.status}
              options={COMMISSION_STATUSES}
              onChange={(status) =>
                run(
                  setCommission({ data: { commissionId: c.id, status: status as "approved" } }),
                  "Commission updated",
                )
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="payouts" className="mt-6 space-y-3">
          {(data?.payouts ?? []).length === 0 && <EmptyState message="No payout requests." />}
          {(data?.payouts ?? []).map((p) => (
            <Row
              key={p.id}
              title={`${inr(p.amount)} · ${p.method.toUpperCase()}`}
              meta={`${p.partners?.partner_code ?? ""} · ${shortDate(p.created_at)} · ${
                p.method === "upi"
                  ? `UPI ${p.upi_id_masked ?? "—"}`
                  : `${p.bank_name ?? "Bank"} ${p.account_number_last4 ? `••••${p.account_number_last4}` : "—"} · IFSC ${p.ifsc_masked ?? "—"}`
              }${p.account_holder ? ` · ${p.account_holder}` : ""}`}
              status={p.status}
              options={PAYOUT_STATUSES}
              onChange={(status) =>
                run(
                  setPayout({ data: { payoutId: p.id, status: status as "paid" } }),
                  "Payout updated",
                )
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="customers" className="mt-6 space-y-3">
          {!isLoading && (data?.customers ?? []).length === 0 && (
            <EmptyState message="No customers yet." />
          )}
          {(data?.customers ?? []).map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">{c.full_name || c.email || "Customer"}</p>
                <p className="text-xs text-muted-foreground">
                  {c.email} {c.mobile ? `· ${c.mobile}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={c.blocked ? "blocked" : "active"} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    run(
                      setBlocked({ data: { userId: c.id, blocked: !c.blocked } }),
                      c.blocked ? "Customer unblocked" : "Customer blocked",
                    )
                  }
                >
                  {c.blocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="products" className="mt-6 space-y-3">
          <div className="flex justify-end">
            <ProductDialog
              key="new-product"
              trigger={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New product
                </Button>
              }
              onSave={(payload) => run(saveProduct({ data: payload }), "Product saved")}
            />
          </div>
          {!isLoading && (data?.products ?? []).length === 0 && (
            <EmptyState message="No products yet. Create your first product." />
          )}
          {(data?.products ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category} · {p.sku} · stock {p.stock} · commission{" "}
                  {p.commission_percent ?? form.default_percent}%
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={p.status} />
                <span className="font-medium">{inr(p.sale_price ?? p.price)}</span>
                <ProductDialog
                  product={p}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                  onSave={(payload) => run(saveProduct({ data: payload }), "Product saved")}
                />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <form
            className="grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await run(
                saveSetting({
                  data: {
                    key: "commission",
                    value: {
                      ...(commissionSetting ?? {}),
                      default_percent: Number(form.default_percent),
                      min_payout: Number(form.min_payout),
                      holding_days: Number(form.holding_days),
                    },
                  },
                }),
                "Commission settings saved",
              );
              await run(
                saveSetting({
                  data: {
                    key: "membership",
                    value: {
                      ...(membershipSetting ?? {}),
                      price: Number(form.membership_price),
                    },
                  },
                }),
                "Membership settings saved",
              );
            }}
          >
            {(
              [
                ["default_percent", "Default commission %"],
                ["min_payout", "Minimum payout (₹)"],
                ["holding_days", "Holding period (days)"],
                ["membership_price", "Membership price (₹)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  inputMode="decimal"
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value.replace(/[^\d.]/g, "") })
                  }
                />
              </div>
            ))}
            <Button type="submit" className="sm:col-span-2">
              Save settings
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="audit" className="mt-6 space-y-3">
          {!isLoading && (data?.auditLogs ?? []).length === 0 && (
            <EmptyState message="No admin activity recorded yet." />
          )}
          {(data?.auditLogs ?? []).map((log) => (
            <div key={log.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">{log.action}</p>
              <p className="text-xs text-muted-foreground">
                {shortDate(log.created_at)}
                {log.target ? ` · ${log.target}` : ""}
                {log.old_value != null || log.new_value != null
                  ? ` · ${JSON.stringify(log.old_value)} → ${JSON.stringify(log.new_value)}`
                  : ""}
              </p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function Row({
  title,
  meta,
  status,
  options,
  onChange,
}: {
  title: string;
  meta: string;
  status: string;
  options: readonly string[];
  onChange: (status: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusPill status={status} />
        <Select value={status} onValueChange={onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o} value={o} className="capitalize">
                {o.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  short_description: string | null;
  image_url: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  status: string;
  featured: boolean;
  commission_percent: number | null;
};

type ProductPayload = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  short_description?: string;
  image_url?: string | null;
  price: number;
  sale_price?: number | null;
  stock: number;
  status: "active" | "inactive";
  featured: boolean;
  commission_percent?: number | null;
};

function ProductDialog({
  product,
  trigger,
  onSave,
}: {
  product?: ProductRow;
  trigger: React.ReactNode;
  onSave: (payload: ProductPayload) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? "attar",
    short_description: product?.short_description ?? "",
    image_url: product?.image_url ?? "",
    price: String(product?.price ?? ""),
    sale_price: product?.sale_price != null ? String(product.sale_price) : "",
    stock: String(product?.stock ?? 0),
    status: (product?.status === "inactive" ? "inactive" : "active") as "active" | "inactive",
    featured: Boolean(product?.featured),
    commission_percent:
      product?.commission_percent != null ? String(product.commission_percent) : "",
  });

  const set = (key: keyof typeof f, value: string | boolean) => setF((p) => ({ ...p, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.slug.trim() || !f.sku.trim() || !Number(f.price)) {
      toast.error("Name, slug, SKU and a price above zero are required.");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(f.slug)) {
      toast.error("Slug can only contain lowercase letters, numbers and dashes.");
      return;
    }
    setBusy(true);
    await onSave({
      ...(product?.id ? { id: product.id } : {}),
      name: f.name.trim(),
      slug: f.slug.trim(),
      sku: f.sku.trim(),
      category: f.category.trim(),
      short_description: f.short_description.trim() || undefined,
      image_url: f.image_url.trim() || null,
      price: Number(f.price),
      sale_price: f.sale_price ? Number(f.sale_price) : null,
      stock: Number(f.stock || 0),
      status: f.status,
      featured: f.featured,
      commission_percent: f.commission_percent ? Number(f.commission_percent) : null,
    });
    setBusy(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          {(
            [
              ["name", "Name", "sm:col-span-2"],
              ["slug", "Slug", ""],
              ["sku", "SKU", ""],
              ["category", "Category", ""],
              ["price", "Price (₹)", ""],
              ["sale_price", "Sale price (₹)", ""],
              ["stock", "Stock", ""],
              ["commission_percent", "Commission % (blank = default)", ""],
              ["image_url", "Image URL", "sm:col-span-2"],
              ["short_description", "Short description", "sm:col-span-2"],
            ] as const
          ).map(([key, label, span]) => (
            <div key={key} className={`space-y-1.5 ${span}`}>
              <Label htmlFor={`p-${key}`}>{label}</Label>
              <Input
                id={`p-${key}`}
                value={f[key] as string}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="p-status">Status</Label>
            <Select value={f.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger id="p-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-featured">Featured</Label>
            <Select
              value={f.featured ? "yes" : "no"}
              onValueChange={(v) => set("featured", v === "yes")}
            >
              <SelectTrigger id="p-featured">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="sm:col-span-2" disabled={busy}>
            {busy ? "Saving…" : "Save product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
