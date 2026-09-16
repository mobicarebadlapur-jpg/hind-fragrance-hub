import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell, EmptyState, StatusPill } from "@/components/dash/DashboardShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/session";
import { listAdminPartners, updatePartnerStatus } from "@/lib/admin.functions";

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
      { name: "description", content: "Manage Hind Fragrance partners and platform operations." },
    ],
  }),
  component: AdminConsole,
});

const PARTNER_STATUSES = ["pending", "active", "suspended", "cancelled"] as const;
type PartnerStatus = (typeof PARTNER_STATUSES)[number];

function AdminConsole() {
  const isAdmin = useIsAdmin();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const listPartners = useServerFn(listAdminPartners);
  const updateStatus = useServerFn(updatePartnerStatus);
  const [busyId, setBusyId] = useState<string | null>(null);

  const partnersQuery = useQuery({
    queryKey: ["admin-partners"],
    enabled: isAdmin,
    queryFn: async () => {
      const result = await listPartners();
      if (!result.ok) throw new Error(result.error);
      return result.partners;
    },
  });

  async function changeStatus(partnerId: string, status: PartnerStatus) {
    setBusyId(partnerId);
    try {
      const result = await updateStatus({ data: { partnerId, status } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Partner marked ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    } catch {
      toast.error("Could not update partner status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell title="Admin Console" subtitle={session?.email ?? ""}>
      {!isAdmin ? (
        <EmptyState message="You do not have permission to access the admin console." />
      ) : (
        <Tabs defaultValue="partners">
          <TabsList>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">Partner applications</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Approve pending applications to activate partner referral access.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void partnersQuery.refetch()}
                disabled={partnersQuery.isFetching}
              >
                Refresh
              </Button>
            </div>

            {partnersQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading partners…</p>
            ) : partnersQuery.error ? (
              <EmptyState message="Could not load partner applications." />
            ) : partnersQuery.data?.length === 0 ? (
              <EmptyState message="No partner applications yet." />
            ) : (
              <div className="space-y-3">
                {partnersQuery.data?.map((partner) => (
                  <div
                    key={partner.id}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-medium">{partner.partner_code}</span>
                          <StatusPill status={partner.status} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          User: {partner.user_id}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Referral: {partner.referral_code} · Joined {new Date(partner.joined_at).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {partner.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => void changeStatus(partner.id, "active")}
                            disabled={busyId === partner.id}
                          >
                            {busyId === partner.id ? "Updating…" : "Approve"}
                          </Button>
                        )}
                        {partner.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void changeStatus(partner.id, "suspended")}
                            disabled={busyId === partner.id}
                          >
                            Suspend
                          </Button>
                        )}
                        {(partner.status === "pending" || partner.status === "suspended") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => void changeStatus(partner.id, "cancelled")}
                            disabled={busyId === partner.id}
                          >
                            Cancel
                          </Button>
                        )}
                        {partner.status === "suspended" && (
                          <Button
                            size="sm"
                            onClick={() => void changeStatus(partner.id, "active")}
                            disabled={busyId === partner.id}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  );
}
