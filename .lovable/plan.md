# Hind Fragrance — Pre-Hostinger Final QA Report

No code was changed in this pass. Below: what was verified, what failed, severity, and the fix list required before going live.

## What passed

- **Typecheck**: clean (0 errors).
- **Routes**: `/`, `/shop`, `/cart`, `/checkout`, `/auth`, `/join`, `/business-partner`, `/demo`, `/product/:slug` all return 200 and render.
- **Responsive**: no horizontal overflow at 375px and 1280px on all public pages; no console errors on `/`, `/shop`, `/cart`, `/join`.
- **SEO heads**: every public route has a unique title + description (e.g. "Shop Attars & Perfumes — Hind Fragrance"). Favicon and robots.txt present.
- **Cart/order flow**: add-to-cart from product page works, cart shows subtotal ₹749 + ₹59 shipping = ₹808, "Proceed to checkout" reaches checkout, which correctly shows the "Sign in to checkout" gate for guests.
- **Referral capture**: `/?ref=HFBP10001` stores `hf_referral` in localStorage plus an `hf_ref` cookie with a 30-day expiry.
- **Route guards**: `/admin`, `/partner`, `/account` all redirect signed-out users to `/auth`.
- **Data**: 7 active products, 3 marketing assets, 1 partner; settings present (commission 10%, holding 7 days, min payout ₹500, cookie 30 days, membership ₹199, payment demo_mode = true).
- **Secrets**: `.env` is gitignored; Razorpay keys are only read from `process.env` inside server functions, never in client code.

## Findings by severity

### Blocker — must fix before Hostinger

1. **Public demo-seeding endpoint creates an admin account with a published password.** `/demo` is a public route and `seedDemoAccounts` is an unauthenticated server function that creates `admin@hindfragrance.com` with a hardcoded password and grants the `admin` role. On a live domain anyone can call it and take over the admin console. Fix: delete the `/demo` route and `src/lib/demo.functions.ts`, or gate both behind an env flag that is off in production, and rotate/remove any seeded demo users.
2. **Payments are in demo mode — money is never collected.** `app_settings.payment.demo_mode = true`, so the ₹199 membership and every order are marked "paid" by the server without a gateway. Going live in this state gives away memberships and orders for free. Fix: integrate Razorpay (or keep the site in "coming soon" for payments) and flip `demo_mode` to false only when keys are live.
3. **Live-mode payment verification is not real.** In `membership.functions.ts` the non-demo branch only checks that `RAZORPAY_KEY_SECRET` and a signature string exist — it never computes the HMAC. `payForOrder` has no gateway verification at all. Once demo mode is off, a crafted request can still activate a partner or mark an order paid. Fix: implement real HMAC signature verification for both membership and order payments.

### Critical

4. **Unknown product slug hangs on "Loading…" forever.** `/product/does-not-exist` renders the loading state indefinitely because `throw notFound()` inside the react-query `queryFn` never reaches the route's `notFoundComponent`. The "Fragrance not found" screen exists but is unreachable — bad for users and for Google crawling stale product URLs.
5. **OTP has no delivery provider.** `sendOtp` stores a hashed code but only returns it to the browser in demo mode; there is no SMS/WhatsApp integration. In production the join flow's mobile verification cannot be completed by a real user. Fix: wire an SMS provider before launch, or drop the OTP step from the ₹199 flow.

### Major

6. **Lint fails**: 729 Prettier formatting errors across ~10 files (all auto-fixable with `eslint --fix`). Not a runtime risk, but any CI lint gate on Hostinger deploy will fail.
7. **Cookie window vs holding period mismatch to confirm**: referral cookie is 30 days, commission holding is 7 days. Confirm 7 days is the intended payout hold before launch.

### Minor

8. Transient React hydration-mismatch warnings appeared during rapid client-side navigation (not reproducible on a direct page load of `/cart` or `/checkout`); worth a second look but no visible breakage.
9. No `sitemap.xml` and no `Sitemap:` line in `robots.txt`.
10. No `og:image` / `twitter:image` on any route, so social shares show no preview image. Needs the final absolute production domain URL.
11. Favicon is still the default placeholder icon, not a Hind Fragrance mark.

## Could not be tested in this pass (external dependency)

- **Admin, Partner and Customer dashboards end-to-end** — requires signing in; seeding demo accounts would change database state, which was out of scope for a no-change QA pass. Their code typechecks and their route guards work.
- **Razorpay payment success/failure/webhook** — no live keys.
- **Real OTP SMS delivery** — no SMS provider configured.
- **Google OAuth on the production domain** — needs the final Hostinger domain in the redirect allow-list.
- **Production build output on Hostinger Node/Nitro**, email deliverability, and real DNS/HTTPS behaviour — needs the actual server.

## Recommended fix order before deploy

1. Remove/lock the demo seeding route and endpoint (blocker 1).
2. Decide payment strategy: real Razorpay with HMAC verification, or launch with payments disabled (blockers 2, 3).
3. Fix the product not-found hang (4).
4. Decide OTP: real SMS provider or remove the step (5).
5. Run `eslint --fix`, then add sitemap, og:image and a real favicon (6, 9, 10, 11).
6. Post-deploy smoke test: admin login → create product → partner referral link → customer order → admin marks paid → commission appears → payout request → admin approves.

Approve this and I will start on the fixes in the order above (or tell me which items to skip).
