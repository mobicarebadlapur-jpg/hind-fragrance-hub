# Hind Fragrance Hub — Code Audit Status

Last audit pass: 2026-09-16
Branch: `main`

## Completed in this pass

- Reviewed repository metadata and current `main` branch state.
- Reviewed the build/runtime configuration in `package.json` and `vite.config.ts`.
- Reviewed the SSR wrapper in `src/server.ts` for catastrophic error handling.
- Reviewed the Supabase browser client configuration in `src/integrations/supabase/client.ts`.
- Reviewed `.gitignore` for environment-file protection.
- Confirmed that production secret values should not be committed.
- Added `.env.example` with placeholders for Supabase, Razorpay, OTP, and application URL configuration.

## Security observations

### Supabase public key handling
The frontend uses a publishable Supabase key. A publishable/anon key is expected to be browser-visible; actual authorization must therefore be enforced with Supabase Auth and database RLS/policies. Do not place a Supabase service-role/secret key in frontend code.

### Build-time fallback
`vite.config.ts` contains a fallback Supabase URL and publishable key so builds can work without environment variables. These are public client configuration values, not service-role credentials. If the project later moves fully to environment-managed deployment, the fallback can be removed to reduce configuration duplication.

### Environment files
`.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`. Real Razorpay secrets, OTP credentials, database service-role keys, and other private credentials must remain in deployment/provider secret storage.

### SSR error handling
The custom server wrapper catches runtime failures and normalizes known swallowed SSR errors into an HTML 500 response instead of exposing the raw JSON error body. This is a useful production-hardening layer.

## Next no-credit work queue

1. Review all authenticated/admin route guards and verify role checks are server-enforced where data mutation occurs.
2. Review Supabase queries/mutations and confirm sensitive operations cannot be performed by an untrusted client through missing RLS policies.
3. Review checkout/order/payment flows for client-controlled price, stock, commission, and order-status values.
4. Review referral attribution and self-referral prevention.
5. Review cart and inventory edge cases: duplicate submissions, stale stock, quantity limits, and cancellation/refund reversal.
6. Review admin screens for accidental exposure of private customer/partner data.
7. Review mobile layouts and accessibility of forms, tables, dialogs, and navigation.
8. Add/expand automated checks that can run without paid third-party services.
9. Keep the production deployment checklist aligned with the actual environment variables and provider configuration.

## Credit-dependent items

- Live Razorpay transactions/webhooks require valid provider credentials and a controlled production test.
- Real OTP delivery requires an active OTP/SMS provider account/credits.
- Production deployment verification may require access to the live Hostinger environment.

## Rule for future changes

Every meaningful security, database, payment, order, referral, or deployment change should be committed with a descriptive commit message and reflected in the project documentation.
