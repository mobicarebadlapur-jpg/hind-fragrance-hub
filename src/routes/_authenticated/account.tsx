import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { inr, shortDate } from "@/lib/format";
import { useSession } from "@/lib/session";
import { ensureProfile } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Hind Fragrance" },
      { name: "description", content: "Manage your Hind Fragrance profile and track your orders." },
      { property: "og:title", content: "My Account — Hind Fragrance" },
      { property: "og:description", content: "Profile and order history." },
    ],
  }),
  component: Account,
});

function Account() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const save = useServerFn(ensureProfile);
  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = session?.profile;
    if (p)
      setForm({
        full_name: p.full_name ?? "",
        mobile: p.mobile ?? "",
        address: p.address ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        pincode: p.pincode ?? "",
      });
  }, [session?.profile]);

  const { data: orders } = useQuery({
    queryKey: ["my-orders", session?.userId],
    enabled: Boolean(session?.userId),
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("customer_id", session!.userId!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <DashboardShell
      title="My account"
      subtitle={session?.email ?? ""}
      actions={
        !session?.partner && (
          <Button asChild variant="gold">
            <Link to="/join">Become a partner</Link>
          </Button>
        )
      }
    >
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 space-y-4">
          {(orders ?? []).length === 0 && <EmptyState message="You haven't placed any orders yet." />}
          {(orders ?? []).map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{shortDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={order.status} />
                  <span className="font-medium">{inr(order.total)}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                {order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} × {item.quantity} — {inr(item.line_total)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <form
            className="grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await save({ data: form });
                await queryClient.invalidateQueries({ queryKey: ["session"] });
                toast.success("Profile updated");
              } catch {
                toast.error("Could not update your profile.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {(
              [
                ["full_name", "Full name", 100],
                ["mobile", "Mobile", 10],
                ["city", "City", 80],
                ["state", "State", 80],
                ["pincode", "Pincode", 6],
              ] as const
            ).map(([key, label, max]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key]}
                  maxLength={max}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                maxLength={300}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={busy} className="sm:col-span-2">
              {busy ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
