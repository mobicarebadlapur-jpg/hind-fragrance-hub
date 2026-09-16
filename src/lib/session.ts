import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = "customer" | "partner" | "admin";
export type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & {
  role: AppRole;
};

export type SessionInfo = {
  userId: string | null;
  email: string | null;
  roles: AppRole[];
  profile: ProfileRow | null;
  partner: PartnerRow | null;
};

export async function loadSession(): Promise<SessionInfo> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { userId: null, email: null, roles: [], profile: null, partner: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const typedProfile = profile as ProfileRow | null;
  const role = typedProfile?.role ?? "customer";

  return {
    userId: user.id,
    email: user.email ?? null,
    roles: [role],
    profile: typedProfile,
    // Partner records will be added with the partner data model in the next step.
    partner: null,
  };
}

export function useSession() {
  return useQuery({ queryKey: ["session"], queryFn: loadSession, staleTime: 15_000 });
}

export function useIsAdmin() {
  const { data } = useSession();
  return Boolean(data?.roles.includes("admin"));
}
