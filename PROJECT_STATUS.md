# Hind Fragrance Hub — Project Status & Work Log

Updated: 2026-09-16

## Repository

- Repository: `mobicarebadlapur-jpg/hind-fragrance-hub`
- Default branch: `main`
- Deployment target: Hostinger
- Production domain: `hindfragrance.com`

## What has been built

Hind Fragrance Hub is a full-stack business partner + affiliate + e-commerce platform for Hind Fragrance. The project includes a public storefront, Business Partner membership flow, referral attribution, partner dashboard, customer/order flow, commission engine, payout architecture, admin dashboard, audit logging, notifications architecture, legal pages, and Hostinger deployment tooling.

## Business features implemented

### Public storefront
- Premium fragrance/attar storefront structure
- Home, product discovery and product details
- Search/category/filter architecture
- Cart and checkout flow
- Business Partner opportunity and membership messaging
- Responsive mobile/tablet/desktop UI

### Business Partner system
- ₹199 Business Partner membership architecture
- Partner registration and activation flow
- Partner profile and status handling
- Unique Partner/Referral code and referral URL
- Partner dashboard
- Referral performance and order visibility
- Earnings/commission views
- Payout request architecture
- Marketing center architecture

### Referral system
- Referral-code attribution
- Referral click/session tracking architecture
- Persistent attribution flow
- Product-level referral links
- WhatsApp sharing
- QR-code referral sharing
- Self-referral protection architecture
- Configurable referral rules

### Commission system
- Admin-configurable commission rules
- Default/category/product-level commission architecture
- Commission lifecycle: Pending → Approved → Available → Paid
- Cancellation/refund/reversal handling
- Duplicate-commission protection
- Holding-period/minimum-payout configuration
- Server-side calculation architecture

### Admin system
- Admin dashboard
- Partner management
- Customer management
- Product management
- Price/sale-price/stock/category controls
- Commission controls
- Membership settings
- Order/payment management
- Payout management
- Audit logs
- Reporting architecture
- Sensitive payout details masked in UI

### Payments
- Razorpay integration architecture
- Server-side verification architecture
- Demo/mock payment mode for testing
- Transaction model for membership, orders and payouts
- Real-money production keys are not intended to be committed to GitHub

### Authentication and security
- Role-based access architecture
- Protected admin/partner routes
- Input/API validation architecture
- Secure environment-variable pattern
- OTP architecture with demo mode
- Audit logging
- P0 security hardening completed in the latest development work
- Public demo access route removed during launch hardening

### Orders and inventory
- Customer/order flow
- Payment status handling
- Paid-order inventory updates
- Atomic payment confirmation + stock update work
- Order/commission lifecycle handling

### Legal and trust pages
- Privacy Policy
- Terms page
- Return/Refund Policy
- Shipping Policy
- Legal navigation integrated into the site
- Demo footer access removed where required for launch hardening

## Latest security/launch-hardening work

The latest GitHub history contains these important changes:

- `d66f54f9b1f0bed37c8d1e18c5419675d27891f3` — Fixed P0 security issues
- `ee4c2e3d09290c4dd8b525b0785878f181f65357` — Changes
- `0dcd56b130436e0c8a8c3ea9fe0ec287abde3bb6` — Work in progress
- `4e023f43e3c9daab27b49030e41029ef99679a85` — Audited site for live bugs
- `03cbb8d664bbe390f2696ae0b510b7086cefc46e` — Synced generated route tree after launch hardening
- `25a4a5e20c355c2c4bc6b5d5836c53987ea75653` — Removed public demo access route
- `80b3dab83072f13f856d96b57438a3b38e88b3be` — Confirmed payment and stock atomically
- `bd18fc5a98eea38dc9e907c609b59b8a5c26a2ce` — Made paid-order inventory update atomic

## Deployment

The repository contains deployment automation for Hostinger. Earlier deployment work moved the production artifact publishing flow to a GitHub Actions workflow using the built-in `GITHUB_TOKEN`, with the generated deployment artifact published to the `deploy` branch.

Important deployment history includes:

- `60e7e274a46e50615794053dcba009f47eeb9c7d` — deployment implementation
- `606a0110e4afdd3641f26b1a554b4e6f0f2fd163` — validate prebuilt Hostinger artifact during build
- `2e14f59fadce576f988e9ea42d6b43e5ac4e3f4f` — deploy sanity checks

Hostinger still needs to be kept in sync with the latest generated `deploy` artifact when a new production deployment is required.

## Production-readiness notes

The codebase is substantially built and has received launch/security hardening, but production activation still requires environment-specific verification. In particular:

1. Configure production environment variables on Hostinger/server runtime.
2. Configure and verify live Razorpay credentials and webhook/payment verification.
3. Configure a production OTP/SMS/WhatsApp provider if OTP is enabled for real users.
4. Verify Supabase/database production configuration and RLS/auth policies where applicable.
5. Pull/redeploy the latest `deploy` branch artifact on Hostinger.
6. Run an end-to-end production smoke test: registration → payment → activation → referral → order → payment confirmation → inventory → commission → payout.
7. Confirm domain, HTTPS, redirects, email/notification integrations, and operational monitoring.

## Important security rule

Never commit production secrets, Razorpay secret keys, OTP provider secrets, database service-role keys, or other credentials to GitHub. Use Hostinger/GitHub environment secrets or the appropriate server-side secret store.

## Development/demo data

The project specification contains demo entities such as Demo Partner, Demo Customer and sample fragrance products. Demo credentials and mock payment/OTP behavior must remain clearly separated from production credentials and services.

## Working principle going forward

Every meaningful feature, security fix, database change, deployment change, and launch-hardening change should be committed to GitHub with a descriptive commit message. This file should be updated when a major milestone changes the production status.
