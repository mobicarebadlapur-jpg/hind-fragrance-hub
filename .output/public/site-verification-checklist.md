# Hind Fragrance Production Verification Checklist

This file is an internal deployment checklist. It does not contain credentials or payment secrets.

## Business identity
- [ ] Verify the public legal/business details against the current GST and Udyam records before publishing.
- [ ] Keep Hind Fragrance as the customer-facing brand only where supported by the official registration records.

## Payments
- [ ] Configure Razorpay only after the correct Razorpay account and website review are approved.
- [ ] Store live Razorpay secrets only in Hostinger/server environment variables; never commit them to GitHub.
- [ ] Verify payment signatures server-side before marking an order paid.

## Production
- [ ] Verify GitHub `main` deploys successfully on Hostinger.
- [ ] Test customer, partner and admin permissions with separate accounts.
- [ ] Test checkout, cancellation, refund and commission reversal flows.
- [ ] Test mobile, tablet and desktop layouts.
- [ ] Verify Terms, Privacy, Shipping, Returns/Refunds, Cancellation, Contact and Partner/Commission policies are published before live payment activation.
