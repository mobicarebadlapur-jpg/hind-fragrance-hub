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
  "/site-verification-checklist.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": '"45f-4Wi+gIigVhEZSRBCXCgQq8THFPc"',
    "mtime": "2026-09-05T22:33:38.514Z",
    "size": 1119,
    "path": "../public/site-verification-checklist.md"
  },
  "/assets/PublicLayout-GpTujoed.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"786-q+Upk+mEm5CUDaqDow+OPBlIH1o"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 1926,
    "path": "../public/assets/PublicLayout-GpTujoed.js"
  },
  "/assets/SiteHeader-kUDHOB6o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b978-R3z+TXRhsgBLP7VFO61S7LMGQqo"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 47480,
    "path": "../public/assets/SiteHeader-kUDHOB6o.js"
  },
  "/assets/account-CsZxZnCI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d02-q0PsansAlYD9dAKhqFOrYRGgBVQ"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 3330,
    "path": "../public/assets/account-CsZxZnCI.js"
  },
  "/assets/account.functions-BJd6aLPu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"187-Z9JUyPhXzH6SB9FyHEG2uQqbsV0"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 391,
    "path": "../public/assets/account.functions-BJd6aLPu.js"
  },
  "/assets/admin-5PYpq-oT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"50f4-PQFO1E0FDzwthaooHtArj+EZAjk"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 20724,
    "path": "../public/assets/admin-5PYpq-oT.js"
  },
  "/assets/auth-Cv0Eg3em.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b13-KNcZhUzNQFipqdMamlKV9J9/7mY"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 6931,
    "path": "../public/assets/auth-Cv0Eg3em.js"
  },
  "/assets/auth-middleware-BE9BROfw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"55-iZSwbZeqeXGt5i5SdIGGoTNLHbM"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 85,
    "path": "../public/assets/auth-middleware-BE9BROfw.js"
  },
  "/assets/business-partner-UGdRRrQR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"301b-QCNpvTyGiW/FdGlJspcIMm+Z4K8"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 12315,
    "path": "../public/assets/business-partner-UGdRRrQR.js"
  },
  "/assets/cart-D2fZZXOu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c80-HuIVNU0BLeWo40A/aeGe0V4trSM"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 3200,
    "path": "../public/assets/cart-D2fZZXOu.js"
  },
  "/assets/check-CI0U0y-f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d-1pfGMjPl6HAOYNS6bkfhjZL6R2U"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 125,
    "path": "../public/assets/check-CI0U0y-f.js"
  },
  "/assets/checkout-BddgjJFd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16d7-VWcZ6F6ZELEr1nf9R0elM5ralf0"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 5847,
    "path": "../public/assets/checkout-BddgjJFd.js"
  },
  "/assets/chevron-down-VAd8z-7I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"86-y4muJMxXr4aMkOpnFwAUe2nJs5Y"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 134,
    "path": "../public/assets/chevron-down-VAd8z-7I.js"
  },
  "/assets/copy-BdImKpHx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ed-Wa1E55FWXLJA/vF62J20ENwNQkA"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 237,
    "path": "../public/assets/copy-BdImKpHx.js"
  },
  "/assets/createServerFn-BG2zIcY6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1216-XXeOMpSBkC62kfRQWwhWi/7z9nY"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 4630,
    "path": "../public/assets/createServerFn-BG2zIcY6.js"
  },
  "/assets/format-qrl9hy2l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b1-owJnjZ5wNdngpar4TxZzahvDSpY"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 689,
    "path": "../public/assets/format-qrl9hy2l.js"
  },
  "/assets/demo-CKD9pv3c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"730-YDXOIItPWoopQREaF1LDkIy1PvI"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 1840,
    "path": "../public/assets/demo-CKD9pv3c.js"
  },
  "/assets/hero-fragrance-F9SjCqfn.jpg": {
    "type": "image/jpeg",
    "etag": '"28ef1-XFxsCF7Bst5Al7KG1AKruyG/Jkg"',
    "mtime": "2026-09-05T22:33:37.404Z",
    "size": 167665,
    "path": "../public/assets/hero-fragrance-F9SjCqfn.jpg"
  },
  "/assets/index-Cj8IXikH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b99-Oep6kqbTUzedXLIWxFT+3RBhiYc"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 15257,
    "path": "../public/assets/index-Cj8IXikH.js"
  },
  "/assets/index-DBCXmgbO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"27b-OB0nbku7NOoleQdnRrxKOVhuGMg"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 635,
    "path": "../public/assets/index-DBCXmgbO.js"
  },
  "/assets/index-JRioi5G2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14b8-apDpXvL1omO77nKOrtVeJANCjLI"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 5304,
    "path": "../public/assets/index-JRioi5G2.js"
  },
  "/assets/ProductCard-DL0W0gBM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6a1-BzGF6yojlk24PGQJm4w9IfsMFrM"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 1697,
    "path": "../public/assets/ProductCard-DL0W0gBM.js"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0"',
    "mtime": "2026-09-05T22:33:38.514Z",
    "size": 160,
    "path": "../public/robots.txt"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y"',
    "mtime": "2026-09-05T22:33:38.514Z",
    "size": 20373,
    "path": "../public/favicon.ico"
  },
  "/assets/index-DFLB6-O2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a3538-Sb1V4wU31TvgJLPFdvT32qXSPnU"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 668984,
    "path": "../public/assets/index-DFLB6-O2.js"
  },
  "/assets/input-g-KahbNA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"253-mX+P5E9PimTYYQ+fis7y7cpMgaI"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 595,
    "path": "../public/assets/input-g-KahbNA.js"
  },
  "/assets/join-DF0GFAlQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"19c0-FtCBy9jx7p1L8kqyuzked2saQVs"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 6592,
    "path": "../public/assets/join-DF0GFAlQ.js"
  },
  "/assets/label-D7xs_Lzf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"29b-22b1qXWut/XANHHxmvDjbXyYqiU"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 667,
    "path": "../public/assets/label-D7xs_Lzf.js"
  },
  "/assets/product._slug-Blg_U7OT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c03-nWQyL5AZOhqNjx2oDdoYsVHnClU"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 3075,
    "path": "../public/assets/product._slug-Blg_U7OT.js"
  },
  "/assets/partner-DAMgRdsQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d07-76emmJa2gRT0pl6QQ19qu+tam8o"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 36103,
    "path": "../public/assets/partner-DAMgRdsQ.js"
  },
  "/assets/product._slug-sDeaiMbq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-JNoZuUuBOOa5Yt5eiEkRcowkOOE"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 591,
    "path": "../public/assets/product._slug-sDeaiMbq.js"
  },
  "/assets/route-D3i9zE_J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-rriOT5DtDMa1QIPkyiHzyS/mVt4"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 95,
    "path": "../public/assets/route-D3i9zE_J.js"
  },
  "/assets/select-DAd-rUY1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"117ef-+qiGDJ3EDacdeXxLGi8k/CHn0Xc"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 71663,
    "path": "../public/assets/select-DAd-rUY1.js"
  },
  "/assets/shield-check-BK0DuokA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"141-d1Hn/Un/V7XbUbWuFsAw+CvjeZo"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 321,
    "path": "../public/assets/shield-check-BK0DuokA.js"
  },
  "/assets/shop-qHbL4m79.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"73d-tI0LYo39GBjEVl8+SfGvhIfoapA"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 1853,
    "path": "../public/assets/shop-qHbL4m79.js"
  },
  "/assets/styles-B1iYvzhH.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"14df0-x5Bo0InFQxr1AZHf4tmoJzMQVhc"',
    "mtime": "2026-09-05T22:33:37.405Z",
    "size": 85488,
    "path": "../public/assets/styles-B1iYvzhH.css"
  },
  "/assets/tabs-CwgZhuUy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24ed-OXcJ5nO+CCkC7HOfZ8ZXQBJ59HM"',
    "mtime": "2026-09-05T22:33:37.406Z",
    "size": 9453,
    "path": "../public/assets/tabs-CwgZhuUy.js"
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
