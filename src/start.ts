import { createStart } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Keep Start-level configuration minimal while the Hostinger SSR runtime
// resolves the middleware chain. CSRF middleware stays attached locally to the
// affected server functions; only the Supabase bearer attacher is global, so
// every protected server function receives the signed-in user's token.
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
}));
