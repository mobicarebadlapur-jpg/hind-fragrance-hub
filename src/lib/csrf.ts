import { createMiddleware } from "@tanstack/react-start";

type CsrfSecFetchSite = "same-origin" | "same-site" | "cross-site" | "none";

type CsrfFilterContext = {
  request: Request;
  pathname: string;
  handlerType: "serverFn" | "router";
};

type CsrfOptions = {
  filter?: (ctx: CsrfFilterContext) => boolean | Promise<boolean>;
  allowRequestsWithoutOriginCheck?: boolean;
};

const csrfSymbol = Symbol.for("tanstack-start:csrf-middleware");

function isAllowedFetchSite(value: string | null): boolean {
  if (!value) return false;
  const site = value as CsrfSecFetchSite;
  return site === "same-origin" || site === "same-site" || site === "none";
}

function sameOrigin(value: string, requestUrl: string): boolean {
  try {
    return new URL(value).origin === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}

function isSafeSameOriginRequest(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite) return isAllowedFetchSite(secFetchSite);

  const origin = request.headers.get("origin");
  if (origin) return sameOrigin(origin, request.url);

  const referer = request.headers.get("referer");
  if (referer) return sameOrigin(referer, request.url);

  return false;
}

/**
 * Hostinger-safe CSRF middleware for TanStack Start server functions.
 * This intentionally avoids @tanstack/start-client-core's createCsrfMiddleware
 * because older/mismatched SSR facades can expose that export as undefined.
 */
export function createHostingerCsrfMiddleware(options: CsrfOptions = {}) {
  const middleware = createMiddleware({ type: "request" }).server(
    async ({ request, pathname, handlerType, next }) => {
      const ctx: CsrfFilterContext = { request, pathname, handlerType };
      if (options.filter && !(await options.filter(ctx))) return next();

      if (options.allowRequestsWithoutOriginCheck || isSafeSameOriginRequest(request)) {
        return next();
      }

      return new Response("Forbidden", { status: 403 });
    },
  );

  Object.defineProperty(middleware, csrfSymbol, { value: true });
  return middleware;
}
