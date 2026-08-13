import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

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

  const [roles, profile, partner] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("partners").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return {
    userId: user.id,
    email: user.email ?? null,
    roles: (roles.data ?? []).map((r) => r.role),
    profile: profile.data ?? null,
    partner: partner.data ?? null,
  };
}

export function useSession() {
  return useQuery({ queryKey: ["session"], queryFn: loadSession, staleTime: 15_000 });
}

export function useIsAdmin() {
  const { data } = useSession();
  return Boolean(data?.roles.includes("admin"));
}
