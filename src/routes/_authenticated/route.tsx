import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  // Auth is currently client-side in this TanStack Start app.
  // Keep protected routes out of SSR until cookie-based SSR auth is added.
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    return { claims: data.claims };
  },
  component: () => <Outlet />,
});
