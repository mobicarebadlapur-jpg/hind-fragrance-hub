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
    "mtime": "2026-09-22T12:49:51.190Z",
    "size": 20373,
    "path": "../public/favicon.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0"',
    "mtime": "2026-09-22T12:49:51.190Z",
    "size": 160,
    "path": "../public/robots.txt"
  },
  "/site-verification-checklist.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": '"45f-4Wi+gIigVhEZSRBCXCgQq8THFPc"',
    "mtime": "2026-09-22T12:49:51.190Z",
    "size": 1119,
    "path": "../public/site-verification-checklist.md"
  },
  "/assets/ProductCard-D21taab6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6a1-L3fz7/DKvX7GgHWdkHSKxX/M3QU"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 1697,
    "path": "../public/assets/ProductCard-D21taab6.js"
  },
  "/assets/PublicLayout-RIjWeYIQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"87d-MtUDwoRAKOyvm8XFnOOnufVYDNE"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 2173,
    "path": "../public/assets/PublicLayout-RIjWeYIQ.js"
  },
  "/assets/SiteHeader-C6SgR3cW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b978-yiheTZTJNB3b2tJiewsrR9HDsBE"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 47480,
    "path": "../public/assets/SiteHeader-C6SgR3cW.js"
  },
  "/assets/account-D9yVRZrN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"cdd-Gz5YGezqSWS6+fvmuPJyuHkX6Fo"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 3293,
    "path": "../public/assets/account-D9yVRZrN.js"
  },
  "/assets/account.functions-DmKMubTC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"15d-ZhWkrUg7GwwI5uRRTykT+i1hHuw"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 349,
    "path": "../public/assets/account.functions-DmKMubTC.js"
  },
  "/assets/admin-9mL2Itqt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"50ca-yv592i49j8aSEYAW/QZcvOeKN0s"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 20682,
    "path": "../public/assets/admin-9mL2Itqt.js"
  },
  "/assets/auth-mSM1Y0CB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b13-7Tr/yZjHdvF3XRhF9sLLOJ/yfRo"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 6931,
    "path": "../public/assets/auth-mSM1Y0CB.js"
  },
  "/assets/auth-middleware-dGKLXMQR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1241-FTOwSsm7R542WxwS4/4NkwQWZ/A"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 4673,
    "path": "../public/assets/auth-middleware-dGKLXMQR.js"
  },
  "/assets/business-partner-BLL_alwA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"301b-eaIcbnZHDNL552x81fjJiIqxRvM"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 12315,
    "path": "../public/assets/business-partner-BLL_alwA.js"
  },
  "/assets/cart-D-s5615E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c80-JVnX3IxB4wxhgiyXWnH8xcsgMZo"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 3200,
    "path": "../public/assets/cart-D-s5615E.js"
  },
  "/assets/check-CtPGKUeF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d-BpYawhydZ2Br/e6LLMlsdmo75fc"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 125,
    "path": "../public/assets/check-CtPGKUeF.js"
  },
  "/assets/checkout-BsEp8D9b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16ad-zj5ALx+u9tZK5vRya8k0JcFvt30"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 5805,
    "path": "../public/assets/checkout-BsEp8D9b.js"
  },
  "/assets/chevron-down-CH8hvLbS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"86-t2Z3dc49yGQQEcpOLXs9LCnG1rc"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 134,
    "path": "../public/assets/chevron-down-CH8hvLbS.js"
  },
  "/assets/copy-D3yA0k39.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ed-nDbGh7WOMUN2tTKEXUNzzHKBm9w"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 237,
    "path": "../public/assets/copy-D3yA0k39.js"
  },
  "/assets/format-qrl9hy2l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b1-owJnjZ5wNdngpar4TxZzahvDSpY"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 689,
    "path": "../public/assets/format-qrl9hy2l.js"
  },
  "/assets/index-BfOMTH5t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b99-xhK18cgt757cEJotrUW+oq/n/+I"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 15257,
    "path": "../public/assets/index-BfOMTH5t.js"
  },
  "/assets/hero-fragrance-F9SjCqfn.jpg": {
    "type": "image/jpeg",
    "etag": '"28ef1-XFxsCF7Bst5Al7KG1AKruyG/Jkg"',
    "mtime": "2026-09-22T12:49:49.462Z",
    "size": 167665,
    "path": "../public/assets/hero-fragrance-F9SjCqfn.jpg"
  },
  "/assets/index-D9EJ0s2p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14b8-aO1OhXV0esJ/MkvZi2kiYYdJiHw"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 5304,
    "path": "../public/assets/index-D9EJ0s2p.js"
  },
  "/assets/index-DZZlzEJB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"280-Oozy3S+1Etehd4DuuzCvgOwgE8I"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 640,
    "path": "../public/assets/index-DZZlzEJB.js"
  },
  "/assets/input-Dc7aOfBU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"253-g8CsgBn+etih4BDh9zZTGpH32cc"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 595,
    "path": "../public/assets/input-Dc7aOfBU.js"
  },
  "/assets/join-ByHzJ-1P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1996-W4SeU4xYkw3l0QeqMm4YO9aKNxo"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 6550,
    "path": "../public/assets/join-ByHzJ-1P.js"
  },
  "/assets/index-DJsb_GXf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a387a-qMgnaIQNJXVpi4PgQ0Bk+/R7csE"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 669818,
    "path": "../public/assets/index-DJsb_GXf.js"
  },
  "/assets/label-DlOcpkO9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"29b-p0/LWmfwHkpA9bjS0ZaW3UI3BqI"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 667,
    "path": "../public/assets/label-DlOcpkO9.js"
  },
  "/assets/partner-bL7trIcA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8cdd-9M2XMMCldglHK1IxhU9tKUSx7SY"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 36061,
    "path": "../public/assets/partner-bL7trIcA.js"
  },
  "/assets/privacy-o-FA7Nsh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae2-gJKpfNfatk3J4rdqDmUQo18OExo"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 2786,
    "path": "../public/assets/privacy-o-FA7Nsh.js"
  },
  "/assets/product._slug-BlV5VbY7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c03-/8TCxJxzzQqj0KIFsrV0eCDM/l8"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 3075,
    "path": "../public/assets/product._slug-BlV5VbY7.js"
  },
  "/assets/refund-CPgySOSV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"809-xwUJr1CteaiDI+ug7/7veQLsZa0"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 2057,
    "path": "../public/assets/refund-CPgySOSV.js"
  },
  "/assets/product._slug-trkxynV9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-/BpLBt9r5fbprK0YmOy2+g3OXww"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 591,
    "path": "../public/assets/product._slug-trkxynV9.js"
  },
  "/assets/route-B2hyMGjj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-I68/GWtgg7V+5UcrN4EtLWczEus"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 95,
    "path": "../public/assets/route-B2hyMGjj.js"
  },
  "/assets/select-C6f7QY3n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"117ef-JSNU0gshHrIaCrQ4MinsjyD/bks"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 71663,
    "path": "../public/assets/select-C6f7QY3n.js"
  },
  "/assets/shield-check-qa6j5lML.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"141-Vz2jf+/zDMfydf/GeX64KANhXS0"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 321,
    "path": "../public/assets/shield-check-qa6j5lML.js"
  },
  "/assets/shipping-C2rIY68N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7ff-lsnf0aj/PKdXQ1T3g7yQ58TuslI"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 2047,
    "path": "../public/assets/shipping-C2rIY68N.js"
  },
  "/assets/shop-CNDNwRXu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"73d-WNbQOxGZ7+taK+oZtdDpEDt8cX8"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 1853,
    "path": "../public/assets/shop-CNDNwRXu.js"
  },
  "/assets/styles-Q_5qna6U.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"14f7e-dncemmr4FVDA8j6Msymg0YINfeA"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 85886,
    "path": "../public/assets/styles-Q_5qna6U.css"
  },
  "/assets/tabs-B_0WQyfg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24ed-l4HUwTEuiQFu+6c+1hXYOoJ167Y"',
    "mtime": "2026-09-22T12:49:49.465Z",
    "size": 9453,
    "path": "../public/assets/tabs-B_0WQyfg.js"
  },
  "/assets/terms-BERNUb8g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"93d-uwkIj0ekxNW1bgo2Ov0tmff5/nU"',
    "mtime": "2026-09-22T12:49:49.464Z",
    "size": 2365,
    "path": "../public/assets/terms-BERNUb8g.js"
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
