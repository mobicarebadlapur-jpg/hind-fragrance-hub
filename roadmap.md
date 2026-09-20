# Roadmap

## P0 (in progress)
- [x] P0-1 Apply `confirm_paid_order` payment/stock function to production DB
- [ ] P0-1b Resolve security linter warning on SECURITY DEFINER functions
- [ ] P0-2 Demo payment safety: block demo-mode paid orders for ordinary customers
- [ ] P0-3 Remove demo seeding code (`src/lib/demo.functions.ts` + references)
- [ ] P0-4 Legal pages 404 live — deployment/build fix (source routes exist)

## Queued (awaiting user "next")
- [ ] Auth review: sign up / sign in / sign out, session persistence, error+loading states,
      protected route coverage (account/admin/partner), role checks via user_roles,
      RLS verification. Requested 20 Sep; do not start until P0 approved.

## P1 (blocked on approval)
- Partner table anon read exposure
- referral_clicks open insert
- Rate limiting beyond OTP
- SMS provider for OTP
