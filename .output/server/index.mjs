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
    "mtime": "2026-09-17T11:52:06.637Z",
    "size": 20373,
    "path": "../public/favicon.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0"',
    "mtime": "2026-09-17T11:52:06.637Z",
    "size": 160,
    "path": "../public/robots.txt"
  },
  "/site-verification-checklist.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": '"45f-4Wi+gIigVhEZSRBCXCgQq8THFPc"',
    "mtime": "2026-09-17T11:52:06.637Z",
    "size": 1119,
    "path": "../public/site-verification-checklist.md"
  },
  "/assets/DashboardShell-DLCL0eqz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6df-itak7gzHqZnC6VHjVvyT0Ha3sC4"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 1759,
    "path": "../public/assets/DashboardShell-DLCL0eqz.js"
  },
  "/assets/PublicLayout-0ludiAi4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"87d-gTsWNO/LEtoUtd5Fk03ji/cLEaQ"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 2173,
    "path": "../public/assets/PublicLayout-0ludiAi4.js"
  },
  "/assets/ProductCard-Cr-FLXNO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6a1-LIL0E1+kruuaKZPxgVXsYYWwypQ"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 1697,
    "path": "../public/assets/ProductCard-Cr-FLXNO.js"
  },
  "/assets/_orderId-IZjBZ5RN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2984-1qcwKWljMDItbKxkRMoDvLdhk2w"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 10628,
    "path": "../public/assets/_orderId-IZjBZ5RN.js"
  },
  "/assets/SiteHeader-Ppxzxr1w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b8d8-XgdPXCDuVJn2mZ9/uRee1djWNGo"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 47320,
    "path": "../public/assets/SiteHeader-Ppxzxr1w.js"
  },
  "/assets/account.functions-dgpALiPS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"158-s/EniCgK0xhr0SY1B01gVRtjUlE"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 344,
    "path": "../public/assets/account.functions-dgpALiPS.js"
  },
  "/assets/admin-C27hNHgV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3e38-Or951o6UjEkUR+WxaUNK6cctAkI"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 15928,
    "path": "../public/assets/admin-C27hNHgV.js"
  },
  "/assets/account-KtwoLlTV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ddf-yuja+GW4IFOBGVhFl16ft+kJQ2k"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 3551,
    "path": "../public/assets/account-KtwoLlTV.js"
  },
  "/assets/admin-dashboard-n9Fu5HkC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100e-KhKKU+7L8p2mGUhVOPNX6x6W3SM"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 4110,
    "path": "../public/assets/admin-dashboard-n9Fu5HkC.js"
  },
  "/assets/admin-payouts-7ag1PDwu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"116a-v9ZmrsSXPItqK1ggvjfj85+aOqs"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 4458,
    "path": "../public/assets/admin-payouts-7ag1PDwu.js"
  },
  "/assets/admin-refunds-DXkSwZaz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dea-A/vQtGh/zD8LXwPi6MV4fVgNjkk"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 3562,
    "path": "../public/assets/admin-refunds-DXkSwZaz.js"
  },
  "/assets/admin.functions-WN3DzMXX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"67f-eUTxM56d5tn7dEiAxCVB1J2OvE0"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 1663,
    "path": "../public/assets/admin.functions-WN3DzMXX.js"
  },
  "/assets/auth-DdPg_GjB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dc3-hwV1La6qKPxypr600HAwaRbCeYQ"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 3523,
    "path": "../public/assets/auth-DdPg_GjB.js"
  },
  "/assets/auth-middleware-B4Lbm4Dg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1241-TZAekKbrMMRBkEqLVd48vEtkWHc"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 4673,
    "path": "../public/assets/auth-middleware-B4Lbm4Dg.js"
  },
  "/assets/business-partner-DTOQayD5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"301b-FQDZ18uJykINWBBJtzGzVRyQqpg"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 12315,
    "path": "../public/assets/business-partner-DTOQayD5.js"
  },
  "/assets/cart-BWEfS2ce.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c80-2z88alrlCvCNCDSkvUMYe7UMyD8"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 3200,
    "path": "../public/assets/cart-BWEfS2ce.js"
  },
  "/assets/check-sqVtgfs9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d-BvImvvzcLt8fP/Toa3nXoQvwFtc"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 125,
    "path": "../public/assets/check-sqVtgfs9.js"
  },
  "/assets/checkout-CMd14iV2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1be3-meSVgdIrQImG/iEilkqbkhiqhAQ"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 7139,
    "path": "../public/assets/checkout-CMd14iV2.js"
  },
  "/assets/chevron-down-D0uM1Xoz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"86-zQ4bRenMznQ1U1POIOo8owWpxq0"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 134,
    "path": "../public/assets/chevron-down-D0uM1Xoz.js"
  },
  "/assets/format-qrl9hy2l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b1-owJnjZ5wNdngpar4TxZzahvDSpY"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 689,
    "path": "../public/assets/format-qrl9hy2l.js"
  },
  "/assets/hero-fragrance-F9SjCqfn.jpg": {
    "type": "image/jpeg",
    "etag": '"28ef1-XFxsCF7Bst5Al7KG1AKruyG/Jkg"',
    "mtime": "2026-09-17T11:52:04.884Z",
    "size": 167665,
    "path": "../public/assets/hero-fragrance-F9SjCqfn.jpg"
  },
  "/assets/index-CkqgWwU8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"27b-8ycgzys6S2vvQbWsWLEybE74T9g"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 635,
    "path": "../public/assets/index-CkqgWwU8.js"
  },
  "/assets/index-P9PGjyJ5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b99-ttyZFmCkq7l9Rpv8es5qAgExFXM"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 15257,
    "path": "../public/assets/index-P9PGjyJ5.js"
  },
  "/assets/index-XAJoLCGH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14b8-5i3mnS+I1cyzaarqIWazuuqLGGc"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 5304,
    "path": "../public/assets/index-XAJoLCGH.js"
  },
  "/assets/input-DAba_QJZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"253-Jz7xwEtW7jhhDT9dekctVh++xKA"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 595,
    "path": "../public/assets/input-DAba_QJZ.js"
  },
  "/assets/join-CSoQv8OS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f8a-iwryy+KYSpRg09E58W6vyFsy1jI"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 8074,
    "path": "../public/assets/join-CSoQv8OS.js"
  },
  "/assets/label-D2sh73NF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"296-BGqdPs6SP9BRNsYWZAw/XVwhKAM"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 662,
    "path": "../public/assets/label-D2sh73NF.js"
  },
  "/assets/orders.functions-etqwxOun.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1dc-bA0XQwXVLybyySmzpESfiOhHGqw"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 476,
    "path": "../public/assets/orders.functions-etqwxOun.js"
  },
  "/assets/partner-DEuNnz6b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a444-fMre1KRKdQXc3NbA2D5O+EmmT/c"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 107588,
    "path": "../public/assets/partner-DEuNnz6b.js"
  },
  "/assets/privacy-B-X2v7f9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae2-roMKJugnO/QPUS5QNH9tT002nAs"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 2786,
    "path": "../public/assets/privacy-B-X2v7f9.js"
  },
  "/assets/product._slug-ZASlPTjB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-3Q9VFPZ/ZH1eSsDr2gGR0bbNOIQ"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 591,
    "path": "../public/assets/product._slug-ZASlPTjB.js"
  },
  "/assets/product._slug-o4UBJ3K1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c03-AMREoRqDNDOxpIyLBGcums1pnfo"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 3075,
    "path": "../public/assets/product._slug-o4UBJ3K1.js"
  },
  "/assets/refund-BbbLcrBM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"809-ArlhM31WObSSGsg+C4J+U8DjcRs"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 2057,
    "path": "../public/assets/refund-BbbLcrBM.js"
  },
  "/assets/refunds.functions-BRubC6UY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"295-RwCeoq+4il8Zkdie+/Pk0Se+z6E"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 661,
    "path": "../public/assets/refunds.functions-BRubC6UY.js"
  },
  "/assets/route-Du1hJIhY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-kuwaCI/VzNZ+HlPHbfiuGKaDbyg"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 95,
    "path": "../public/assets/route-Du1hJIhY.js"
  },
  "/assets/shield-check-BW5PMt2k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"141-NrjJgm7lsGctg6Ddf2kvBLzToXY"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 321,
    "path": "../public/assets/shield-check-BW5PMt2k.js"
  },
  "/assets/shipping-xy9MIclI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7ff-mNwMNvHYmfznCAs4GKIpzQeUYz0"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 2047,
    "path": "../public/assets/shipping-xy9MIclI.js"
  },
  "/assets/shop-D_pwtwJQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"73d-kAC1k+uBVdY8il+oyNBMMVvL5qw"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 1853,
    "path": "../public/assets/shop-D_pwtwJQ.js"
  },
  "/assets/tabs-Da_4z7s4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1e54-z+WgHKbwaVfQB7USScO+aFky6yQ"',
    "mtime": "2026-09-17T11:52:04.887Z",
    "size": 7764,
    "path": "../public/assets/tabs-Da_4z7s4.js"
  },
  "/assets/terms-D1K4HY0w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"93d-Jf7Gh6cQx4O0Rp3lLOUxKoq35YU"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 2365,
    "path": "../public/assets/terms-D1K4HY0w.js"
  },
  "/assets/styles-DXWl8j8O.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"15b68-Y2d2U7wrMmP4IhymWdWLhHAr24U"',
    "mtime": "2026-09-17T11:52:04.886Z",
    "size": 88936,
    "path": "../public/assets/styles-DXWl8j8O.css"
  },
  "/assets/index-Dh3X7C91.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a426d-84zTL6HXrb24N9GvyWWhIY3mcFI"',
    "mtime": "2026-09-17T11:52:04.888Z",
    "size": 672365,
    "path": "../public/assets/index-Dh3X7C91.js"
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
