import { createFileRoute, redirect } from "@tanstack/react-router";
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
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth", search: { redirect: "/admin" } });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") throw redirect({ to: "/account" });
  },
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
const PARTNER_STATUSES = [
  "pending",
  "payment_pending",
  "active",
  "suspended",
  "cancelled",
] as const;
const COMMISSION_STATUSES = [
  "pending",
  "approved",
  "available",
  "paid",
  "cancelled",
  "reversed",
] as const;
const PAYOUT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
] as const;

function AdminConsole() {
  const isAdmin = useIsAdmin();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  // The existing admin UI is already wired to the future commerce tables.
  // Role access is enforced here now; those tables will be added in the commerce phase.
  return (
    <DashboardShell title="Admin Console" subtitle={session?.email ?? ""}>
      {!isAdmin ? (
        <EmptyState message="You do not have permission to access the admin console." />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Admin access enabled</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Product, order, partner, commission and payout controls will become active as their
            database modules are connected.
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
