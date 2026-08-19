globalThis.__nitro_main__ = import.meta.url;
import { b as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, a as toEventHandler, b as defineLazyEventHandler, c as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y"',
    "mtime": "2026-08-19T19:25:55.347Z",
    "size": 20373,
    "path": "../public/favicon.ico"
  },
  "/site-verification-checklist.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": '"45f-4Wi+gIigVhEZSRBCXCgQq8THFPc"',
    "mtime": "2026-08-19T19:25:55.347Z",
    "size": 1119,
    "path": "../public/site-verification-checklist.md"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0"',
    "mtime": "2026-08-19T19:25:55.347Z",
    "size": 160,
    "path": "../public/robots.txt"
  },
  "/assets/ProductCard-p0mvNnc1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6a1-D2Y1DttstTHruLahnozuUawv3uI"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 1697,
    "path": "../public/assets/ProductCard-p0mvNnc1.js"
  },
  "/assets/PublicLayout-CpYWW5h8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"786-RGIXvkIMOJV0L6O1mWKxSBjacIo"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 1926,
    "path": "../public/assets/PublicLayout-CpYWW5h8.js"
  },
  "/assets/SiteHeader-S99QY-5M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b978-SG86fkJ78PpSnYF4jfPats181FI"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 47480,
    "path": "../public/assets/SiteHeader-S99QY-5M.js"
  },
  "/assets/account-Dc_kvekk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d02-BbqUi38/sWGvBvdPCp/kk0MsbXs"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 3330,
    "path": "../public/assets/account-Dc_kvekk.js"
  },
  "/assets/account.functions-K6svAu2Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"187-SQYcqAYz+vJEUOvl6PGitvxFFDU"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 391,
    "path": "../public/assets/account.functions-K6svAu2Q.js"
  },
  "/assets/admin-BebwMbts.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"50f4-enF1DILFJ4WxSnbiWwObWc0JxIk"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 20724,
    "path": "../public/assets/admin-BebwMbts.js"
  },
  "/assets/auth-B9IhUbMm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b13-HH7NCa1XebXTiquXSnVrwSxhZGA"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 6931,
    "path": "../public/assets/auth-B9IhUbMm.js"
  },
  "/assets/auth-middleware-D-jthBcd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"55-BzNzmtcZQCNc53mLFki9S9C/Aq8"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 85,
    "path": "../public/assets/auth-middleware-D-jthBcd.js"
  },
  "/assets/business-partner-D0we2KGM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"301b-DxnWQv27BnfJpM30DSN9mieF4MU"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 12315,
    "path": "../public/assets/business-partner-D0we2KGM.js"
  },
  "/assets/cart-h8v8BBP7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c80-JGroqTiquUKhzGgpkk4POy9O1U0"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 3200,
    "path": "../public/assets/cart-h8v8BBP7.js"
  },
  "/assets/check-DB76Q9Ov.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d-4uI8RwAOi22ie9Dj0Z4qCnlTc2g"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 125,
    "path": "../public/assets/check-DB76Q9Ov.js"
  },
  "/assets/checkout-CSL1YGKi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16d7-ArxgaWs+GYm8GNcLg4nKZSmXRcQ"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 5847,
    "path": "../public/assets/checkout-CSL1YGKi.js"
  },
  "/assets/chevron-down-BMDgNFc9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"86-M+X/VfxA8EOKzv37khTRhyukT/c"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 134,
    "path": "../public/assets/chevron-down-BMDgNFc9.js"
  },
  "/assets/createServerFn-DHjf2uAB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1216-k7bWLK58OQ81tlGsTn6ZyTSLNKs"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 4630,
    "path": "../public/assets/createServerFn-DHjf2uAB.js"
  },
  "/assets/copy-CVtYLQUX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ed-0gYHi4OSjYq0GOSHWVbbY9QFVuc"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 237,
    "path": "../public/assets/copy-CVtYLQUX.js"
  },
  "/assets/demo-DxqcVMDx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"730-5X/W6fTyYyMbrmctBeMHK0PyMlY"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 1840,
    "path": "../public/assets/demo-DxqcVMDx.js"
  },
  "/assets/format-qrl9hy2l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b1-owJnjZ5wNdngpar4TxZzahvDSpY"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 689,
    "path": "../public/assets/format-qrl9hy2l.js"
  },
  "/assets/index-BfpsNWWI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b99-2kWrKjm7TMJQH+eczCBaQ59YdMU"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 15257,
    "path": "../public/assets/index-BfpsNWWI.js"
  },
  "/assets/index-CL09rcAz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"27b-gQK7SbH/YhHrDxFr4R80ybCFih4"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 635,
    "path": "../public/assets/index-CL09rcAz.js"
  },
  "/assets/hero-fragrance-F9SjCqfn.jpg": {
    "type": "image/jpeg",
    "etag": '"28ef1-XFxsCF7Bst5Al7KG1AKruyG/Jkg"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 167665,
    "path": "../public/assets/hero-fragrance-F9SjCqfn.jpg"
  },
  "/assets/index-DXLQ7jee.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14b8-FXnl+48Yc8a25U7jBe4oElgtp84"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 5304,
    "path": "../public/assets/index-DXLQ7jee.js"
  },
  "/assets/index-D1JtnmV0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a2eac-WBFC/nzYXEkC8SvtY1GNlotAzGI"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 667308,
    "path": "../public/assets/index-D1JtnmV0.js"
  },
  "/assets/input-YhjjbwxS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"253-UdnEGV9J4eMFzNrp5UwVwEvC99c"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 595,
    "path": "../public/assets/input-YhjjbwxS.js"
  },
  "/assets/join-DykxkYUt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"19c0-p+5xYLMimV5UQxCmkxvoaxKbWQo"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 6592,
    "path": "../public/assets/join-DykxkYUt.js"
  },
  "/assets/label-BbU3QjC9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"29b-3/NL/1wzLuxHlGuG6tT4Y6pZfjw"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 667,
    "path": "../public/assets/label-BbU3QjC9.js"
  },
  "/assets/partner-DG7NTvYF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d07-Y53/PH0Nt0oAwtxrEDgyj6LNLmQ"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 36103,
    "path": "../public/assets/partner-DG7NTvYF.js"
  },
  "/assets/product._slug-BdvuyeMO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c03-AYFJhfYJD71v7rhUAUBMYQceGi8"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 3075,
    "path": "../public/assets/product._slug-BdvuyeMO.js"
  },
  "/assets/product._slug-D3h2X5vt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-6oq3kBlNVlMfKBpKnf3mE0HzRJI"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 591,
    "path": "../public/assets/product._slug-D3h2X5vt.js"
  },
  "/assets/route-DO1MomqR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-yOu33leG2FAIuBmU92tGSn20l2k"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 95,
    "path": "../public/assets/route-DO1MomqR.js"
  },
  "/assets/select-e_JBnQD0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"117ef-aV+8gwFPNPpJIPaLSuazSZMkLO8"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 71663,
    "path": "../public/assets/select-e_JBnQD0.js"
  },
  "/assets/shield-check-GQFg4Qoe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"141-Ox7ib1Vn260O/DbUG2RGfrcOIC8"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 321,
    "path": "../public/assets/shield-check-GQFg4Qoe.js"
  },
  "/assets/shop-BnZsMqoA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"73d-am1pTDh1XbGa2LPTBLpBs0VngWg"',
    "mtime": "2026-08-19T19:25:54.115Z",
    "size": 1853,
    "path": "../public/assets/shop-BnZsMqoA.js"
  },
  "/assets/styles-B1iYvzhH.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"14df0-x5Bo0InFQxr1AZHf4tmoJzMQVhc"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 85488,
    "path": "../public/assets/styles-B1iYvzhH.css"
  },
  "/assets/tabs-BsDhcSrC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24ed-nLPL6ME5wWrHgahCGZkoA2LfcCs"',
    "mtime": "2026-08-19T19:25:54.116Z",
    "size": 9453,
    "path": "../public/assets/tabs-BsDhcSrC.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _vVrfcI = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_WXKrjy = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_WXKrjy };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_vVrfcI)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
