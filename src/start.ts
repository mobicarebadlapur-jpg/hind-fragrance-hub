import { createStart } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { createHostingerCsrfMiddleware } from "./lib/csrf";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createHostingerRequestMiddleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createHostingerCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

function createHostingerRequestMiddleware(handler: (ctx: { next: () => Promise<Response> }) => Promise<Response>) {
  return async (ctx: { next: () => Promise<Response> }) => handler(ctx);
}

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
