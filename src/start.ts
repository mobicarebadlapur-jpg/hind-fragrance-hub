import { createMiddleware, createStart } from "@tanstack/react-start";

import { createHostingerCsrfMiddleware } from "./lib/csrf";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    console.error("[SSR request error]", error);
    throw error;
  }
});

const csrfMiddleware = createHostingerCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
