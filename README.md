# Hind Fragrance Hub

HIND FRAGRANCE – COMPLETE BUSINESS PARTNER & AFFILIATE PLATFORM

Build a complete, production-ready, responsive web application for Hind Fragrance / Alhind Fragrance India.

This is NOT just a landing page. Build a complete functional business platform with:

Public website
Business Partner Membership system
Affiliate/referral system
Partner dashboard
Customer/order tracking
Automatic commission calculation
Admin dashboard
Payment integration architecture
OTP verification
Reports
Payout management
Notifications
Role-based authentication
Database
API/backend architecture

The system must be designed so that it can later be connected to a real domain and deployed on hosting such as Hostinger.

1. BRAND

Brand Name:
Hind Fragrance

Business:
Alcohol-free perfumes, attars, fragrances and related products.

Primary currency:
INR (₹)

Membership:
₹199 Business Partner Membership

The design should look premium, modern and trustworthy.

Use a fragrance/perfume-inspired visual style with:

Premium typography
Clean white/light backgrounds
Elegant dark sections
Gold/luxury accents
Product imagery placeholders
Mobile-first responsive design

Do NOT make the interface look like a generic SaaS template.

2. USER ROLES

Create proper role-based authentication.

Roles:

Admin
Business Partner
Customer
Sales/Staff (optional role prepared for future use)

Each role must have different permissions.

3. PUBLIC WEBSITE

Create these public pages:

Home

Sections:

Hero banner
Hind Fragrance introduction
Featured perfumes/attars
Why choose Hind Fragrance
Business Partner opportunity
How Business Partner program works
Commission explanation
Testimonials
FAQ
Call to action
Footer

CTA buttons:

Shop Now
Become a Business Partner
Login
Join Now
4. BUSINESS PARTNER PAGE

Create a dedicated Business Partner landing page.

Explain:

Join for ₹199

Benefits:

Become an authorized Hind Fragrance Business Partner
Get your own unique referral/affiliate link
Share products with customers
Earn commission on eligible sales
Track referrals
Track orders
Track commissions
View dashboard
View earnings history
Access marketing materials
Future payout facility

Create a clear step-by-step section:

Pay ₹199
Create your Partner Account
Account gets activated
Unique referral link is automatically generated
Share your link
Customer visits website
Customer purchases products
System tracks referral
Commission is calculated automatically
Partner can view earnings and request payout
5. ₹199 MEMBERSHIP SYSTEM

Create complete membership flow.

Flow:

Visitor
→ Join Business Partner
→ Registration
→ Mobile number
→ OTP verification
→ Basic profile
→ ₹199 payment
→ Payment verification
→ Partner account activation
→ Unique referral code generation
→ Unique referral URL generation
→ Redirect to Partner Dashboard

Partner information:

Partner ID
Full Name
Mobile
Email
Address
City
State
PIN Code
Referral Code
Referral Link
Membership Status
Membership Date
Payment ID
Total Sales
Total Commission
Pending Commission
Paid Commission

Membership statuses:

Pending
Payment Pending
Active
Suspended
Cancelled
6. AUTOMATIC REFERRAL LINK

Every active Business Partner must automatically receive a unique referral code.

Example:

HFBP10001

Generate a referral URL such as:

https://hindfragrance.com/?ref=HFBP10001

OR:

https://hindfragrance.com/partner/HFBP10001

The system must automatically create this when membership payment succeeds.

The referral code must be unique.

Do not allow duplicate referral codes.

7. REFERRAL TRACKING

When a customer enters through a Partner referral link:

Store referral information.

Track:

Referral Code
Partner ID
Customer ID
Session
Landing page
Date/time
Order ID
Order amount
Commission
Order status

Use a persistent referral cookie/session where technically appropriate.

Referral attribution should remain available through the customer's shopping journey.

8. CUSTOMER REGISTRATION

Create customer registration/login.

Fields:

Full Name
Mobile Number
Email
Password OR OTP login
Address
City
State
PIN Code

Support OTP verification architecture.

For demo mode, use a mock OTP.

For production, prepare integration points for an SMS/WhatsApp OTP provider.

9. E-COMMERCE / PRODUCT SYSTEM

Create product management architecture.

Products should have:

Product ID
Product name
SKU
Category
Description
Short description
Product images
Price
Sale price
Stock
Status
Featured flag

Categories:

Attar
Perfume
Room Freshener
Gift Sets
Featured Products
New Arrivals

Create:

Product listing
Product details
Search
Category filter
Price filter
Add to cart
Cart
Checkout

The architecture must allow future connection with WooCommerce or another e-commerce backend if required.

10. REFERRAL PURCHASE FLOW

Example:

Partner A has:

HFBP10001

Partner shares:

https://hindfragrance.com/?ref=HFBP10001

Customer clicks link.

System records:

Partner = HFBP10001

Customer buys:

Product = ₹1,000

Order status = Paid

System automatically calculates partner commission according to the configured commission rule.

Commission must NOT be hardcoded into frontend.

Commission settings must be controlled from Admin Panel.

11. COMMISSION ENGINE

Create a proper commission engine.

Admin can configure:

Commission percentage
Fixed commission
Product-specific commission
Category-specific commission
Minimum payout amount
Commission holding period
Commission status

Commission statuses:

Pending
Approved
Available
Paid
Cancelled
Reversed

Example configuration:

Default commission:
10%

If order = ₹1,000

Commission = ₹100

Do not permanently hardcode 10%.

Admin must be able to change the percentage.

Commission should only become payable after the configured order/return period.

12. ORDER STATUS AND COMMISSION

Commission logic:

Order Created
→ Payment Pending
→ Paid
→ Processing
→ Shipped
→ Delivered
→ Commission Pending
→ Commission Approved
→ Commission Available
→ Payout

If order is:

Cancelled
Refunded
Returned

then commission must be cancelled/reversed.

Prevent duplicate commissions for the same order.

13. PARTNER DASHBOARD

Create a premium Business Partner Dashboard.

Dashboard cards:

Membership Status
Partner ID
Referral Code
Total Clicks
Total Referrals
Total Orders
Total Sales
Pending Commission
Available Commission
Paid Commission

Charts:

Sales by month
Commission by month
Referral performance
Orders
14. PARTNER REFERRAL LINK SECTION

Create a dedicated section:

My Referral Link

Show:

Referral Code:
HFBP10001

Referral URL:
https://hindfragrance.com/?ref=HFBP10001

Buttons:

Copy Link
Share on WhatsApp
Share on Facebook
Share
QR Code

Automatically generate a QR code for the referral link.

15. PARTNER MARKETING CENTER

Create a Marketing Center.

Partner can access:

Product images
Banners
Social media posts
WhatsApp promotional messages
Product descriptions
Referral links
Downloadable marketing materials

Each marketing asset should have:

Title
Image/file
Description
Category
Date
Status

Admin can upload/remove marketing materials.

16. PARTNER COMMISSION PAGE

Create:

My Earnings

Table:

Date
Order ID
Customer
Order Amount
Commission
Status

Filters:

Date
Status
Order
Amount

Summary:

Total Commission
Pending
Available
Paid
Cancelled

17. PARTNER PAYOUT SYSTEM

Create payout request architecture.

Partner can request payout when:

Available Commission >= configured minimum payout.

Fields:

Partner ID
Amount
Payout method
Account holder name
Bank name
Account number
IFSC
UPI ID
Request date
Status

Payout statuses:

Requested
Under Review
Approved
Processing
Paid
Rejected

Admin can approve/reject/mark as paid.

Do not expose sensitive bank details publicly.

Mask sensitive information in UI.

18. ADMIN DASHBOARD

Create a powerful Admin Panel.

Admin dashboard cards:

Total Customers
Total Partners
Active Partners
Pending Partners
Total Orders
Total Revenue
Total Commission
Pending Commission
Available Commission
Pending Payouts

Charts:

Revenue
Orders
Partner registrations
Commission
Payouts
Monthly performance
19. ADMIN PARTNER MANAGEMENT

Admin can:

View partners
Search partners
Filter partners
Approve partner
Suspend partner
Activate partner
View partner details
View referral code
View referral link
View sales
View orders
View commissions
View payout history

Admin should be able to manually adjust partner status where authorized.

20. ADMIN CUSTOMER MANAGEMENT

Admin can:

View customers
Search customers
View customer details
View orders
View referral source
View partner attribution
Block/unblock customers
21. ADMIN PRODUCT MANAGEMENT

Admin can:

Add product
Edit product
Delete/deactivate product
Upload images
Set price
Set sale price
Set stock
Set category
Set commission percentage
Feature/unfeature product
22. ADMIN COMMISSION SETTINGS

Create settings page.

Admin can configure:

Default commission:
Example 10%

Minimum payout:
Example ₹500

Commission holding period:
Example 7/15/30 days

Allow product-specific commission:
Yes/No

Allow category-specific commission:
Yes/No

Commission calculation basis:

Product subtotal
Order subtotal
Exclude shipping
Exclude tax
Exclude discounts

Make all of these configurable.

23. ADMIN MEMBERSHIP SETTINGS

Admin can change:

Membership price:
₹199

Membership name:
Business Partner Membership

Membership status:

Active/Inactive

If membership price changes, new registrations should use the new configured price.

Existing memberships should preserve their original payment record.

24. PAYMENT SYSTEM

Prepare proper payment architecture.

Primary payment provider:

Razorpay

Membership payment:

₹199

Payment flow:

Registration
→ Create payment order
→ Razorpay Checkout
→ Payment
→ Verify payment signature/server-side
→ Store transaction
→ Activate membership
→ Generate Partner ID
→ Generate Referral Code
→ Generate Referral Link

IMPORTANT:

Do not put secret Razorpay keys in frontend code.

Use environment variables/server-side functions.

For demo mode, create a MOCK PAYMENT MODE so the complete system can be tested without real money.

Demo payment button:

"Simulate Successful Payment"

This should activate the partner account exactly as a real successful payment would.

25. TRANSACTION SYSTEM

Create transactions table/system.

Fields:

Transaction ID
User ID
Partner ID
Amount
Currency
Payment gateway
Gateway order ID
Gateway payment ID
Status
Payment type
Created date
Updated date

Payment types:

Membership
Product Order
Payout
26. OTP SYSTEM

Create OTP verification architecture.

OTP should be:

Time limited
One-time use
Rate limited
Securely stored/hashed where appropriate

Demo mode:

Show a development OTP only in safe demo mode.

Production mode:

Use environment variables/API integration.

Never expose real OTP secrets.

27. DATABASE

Create a proper relational database structure.

Suggested tables:

users

profiles

partners

customers

memberships

referral_codes

referral_clicks

referrals

products

categories

cart

orders

order_items

commissions

payouts

transactions

otp_verifications

marketing_assets

notifications

admin_settings

commission_settings

audit_logs

Do not put everything into one table.

Use relationships and foreign keys.

Add created_at and updated_at where appropriate.

28. SECURITY

Implement:

Authentication
Authorization
Role-based access control
Protected admin routes
Protected partner routes
Server-side commission calculation
Server-side payment verification
Input validation
API validation
Rate limiting where possible
Secure environment variables
No secret keys in frontend
Audit logging
Protection against duplicate orders/commissions

Partners must only see their own:

Profile
Orders
Referrals
Commissions
Payouts
Marketing data

Customers must only see their own account/orders.

Admin can see everything according to role permissions.

29. NOTIFICATION SYSTEM

Create notification architecture.

Events:

Partner registration
Membership payment success
Partner activation
New referral
New order
Commission generated
Commission approved
Payout requested
Payout approved
Payout paid
Order cancelled/refunded

Notification channels:

In-app
Email
WhatsApp/SMS integration-ready

For demo, use in-app notifications.

30. ADMIN REPORTS

Create reports:

Sales Report
Date
Orders
Revenue
Partner Report
Partner
Registrations
Clicks
Orders
Sales
Commission
Commission Report
Partner
Order
Amount
Commission
Status
Payout Report
Partner
Amount
Date
Status
Membership Report
New memberships
Active memberships
Cancelled memberships
Revenue from memberships

Provide:

Search
Filters
Date range
Export CSV
31. AUDIT LOG

Create admin audit logs.

Track:

Admin
Action
Target
Old value
New value
Date/time
IP where appropriate

Examples:

Admin changed commission from 10% to 12%.

Admin approved payout.

Admin suspended partner.

32. SETTINGS

Create Admin Settings.

Sections:

General

Brand name
Logo
Currency
Contact information

Membership

Membership price
Membership status

Commission

Default percentage
Minimum payout
Holding period

Payment

Razorpay settings
Demo mode

Notifications

Email settings
WhatsApp/SMS integration settings

Referral

Cookie duration
Attribution rules

Security

Admin settings
Session settings
33. REFERRAL RULES

Create configurable referral rules.

Default:

Last valid partner referral gets attribution.

Allow admin to configure:

First click
Last click
Cookie duration

Default cookie duration:

30 days.

Prevent self-referral.

A partner cannot earn commission from their own account/order.

34. MOBILE RESPONSIVE

The complete application must work properly on:

Android phones
iPhone
Tablet
Desktop
Laptop

Partner Dashboard must be especially mobile friendly because partners will mostly use WhatsApp/mobile.

Use:

Bottom navigation or mobile navigation
Responsive tables/cards
Large buttons
Easy copy/share referral link
35. WHATSAPP SHARING

Create WhatsApp share buttons.

Example message:

"Check out Hind Fragrance perfumes and attars. Shop here:
[REFERRAL LINK]"

The referral link must automatically be inserted.

Allow partner to share individual product links containing their referral code.

Example:

https://hindfragrance.com/product/attar-name?ref=HFBP10001

36. QR CODE

Every partner gets:

Main referral QR code
Optional product QR codes

Partner can download/share the QR code.

37. PRODUCT REFERRAL LINKS

Partner dashboard should allow:

Product
→ Generate My Link

Example:

Product:
Imperial Oud

Partner:
HFBP10001

Generated URL:

https://hindfragrance.com/product/imperial-oud?ref=HFBP10001

38. DEMO DATA

Create realistic demo data.

Demo Admin:

Email:
admin@hindfragrance.com

Demo Partner:

Name:
Demo Partner

Partner ID:
HFBP10001

Referral Code:
HFDEMO10001

Demo Customer:

Demo Customer

Create demo products such as:

Imperial Oud
Shanaya
Aura Bloom
Mogra Bloom
Alzahoor

Use placeholder product images if actual images are unavailable.

Clearly mark demo credentials as development/demo only.

39. DEMO MODE

The entire system must be testable without real payment/API credentials.

Include:

Demo login
Demo payment
Demo OTP
Demo order
Demo commission
Demo payout

Example demo flow:

Login as Demo Partner
→ Copy referral link
→ Open referral link
→ Create demo customer
→ Create demo order
→ Simulate successful payment
→ Order appears in Admin
→ Commission is generated
→ Commission appears in Partner Dashboard

Make this flow fully functional.

40. API ARCHITECTURE

Create clean backend API/service structure.

Prepare endpoints/services for:

Authentication

POST /auth/register

POST /auth/login

POST /auth/send-otp

POST /auth/verify-otp

Partner

GET /partners/me

GET /partners/me/referral

GET /partners/me/earnings

GET /partners/me/orders

POST /partners/me/payout

Referral

GET /referral/track

POST /referral/attribute

Orders

POST /orders

GET /orders/

Payments

POST /payments/create

POST /payments/verify

Commission

GET /commissions

POST /commissions/calculate

Admin

GET /admin/dashboard

GET /admin/partners

GET /admin/customers

GET /admin/orders

GET /admin/commissions

GET /admin/payouts

GET /admin/reports

Keep API secrets server-side.

41. CODE QUALITY

Generate clean, maintainable code.

Requirements:

Modular components
Reusable UI components
Clean database schema
Proper error handling
Loading states
Empty states
Form validation
Toast notifications
Confirmation dialogs
Responsive layout
Clear naming
Comments for complex business logic

Do not create fake buttons that do nothing.

If a feature cannot be connected without an external API key, create the complete integration structure and a working demo/mock mode.

42. ERROR HANDLING

Handle:

Invalid login
Invalid OTP
Expired OTP
Duplicate email
Duplicate mobile
Failed payment
Cancelled payment
Duplicate payment
Invalid referral
Expired referral
Cancelled order
Refunded order
Duplicate commission
Insufficient payout balance
Invalid payout details

Show user-friendly messages.

43. ADMIN DEMO FLOW

Admin should be able to:

Login
→ Dashboard
→ See ₹199 membership
→ See partners
→ See customers
→ See products
→ See orders
→ See commissions
→ See payouts
→ Change commission %
→ Change membership price
→ Manage partners
→ Manage marketing assets
→ Export reports

44. PARTNER DEMO FLOW

Partner:

Register
→ Verify OTP
→ Pay ₹199 in Demo Mode
→ Account Activated
→ Partner ID generated
→ Referral Code generated
→ Referral Link generated
→ QR Code generated
→ Dashboard opened

Dashboard:

Total Clicks
Total Referrals
Total Orders
Total Sales
Pending Commission
Available Commission
Paid Commission

Partner can:

Copy link
Share WhatsApp
Generate product link
View orders
View earnings
Request payout
View profile
Download marketing materials

45. CUSTOMER DEMO FLOW

Customer:

Open partner link
→ Referral captured
→ Browse products
→ Add to cart
→ Checkout
→ Demo payment
→ Order created
→ Order appears in Admin
→ Order attributed to partner
→ Commission generated

46. ADMIN COMMISSION TEST

Create a test order:

Product:
Imperial Oud

Order amount:
₹1,000

Commission:
10%

Expected commission:
₹100

The system must calculate this automatically.

Then:

Refund order
→ Commission becomes Reversed.

Do not manually enter commission.

47. DEPLOYMENT

The application should be structured so that it can later be deployed to a custom domain such as:

hindfragrance.com

The frontend should be deployable to external hosting.

If using a managed backend such as Supabase, clearly separate:

Frontend
Backend
Database
Storage
Authentication
Environment variables

Provide a clear deployment README explaining:

Required environment variables
Database setup
Authentication setup
Payment setup
Build command
Production deployment
Custom domain setup
HTTPS/SSL
Database migration
Backup strategy
48. IMPORTANT HOSTING REQUIREMENT

Do NOT assume that simply uploading frontend files to Hostinger automatically creates the entire backend.

Clearly identify which components run on:

Frontend hosting
Backend/serverless functions
Database
Storage
Authentication
Payment gateway

If a backend service is required, make it explicit.

49. FUTURE INTEGRATIONS

Design the system so these can be added later:

Razorpay
WhatsApp API
SMS OTP
Email service
Shiprocket
WooCommerce
Google Analytics
Meta Pixel
Google Login
WhatsApp notifications
GST invoice
Courier tracking
Loyalty points
Coupon system
Subscription
Multi-level affiliate system

Do not implement unnecessary features now, but keep the architecture extensible.

50. IMPORTANT BUSINESS RULE

The Business Partner program is an affiliate/referral sales program.

Do NOT describe it as an investment scheme.

Partners earn commission only from eligible product sales according to configured commission rules.

Do not promise guaranteed income.

51. FINAL REQUIREMENT

Do not only generate a visual prototype.

Build the maximum possible working application.

I want:

Working frontend
Working navigation
Working authentication
Working demo OTP
Working demo membership payment
Working partner creation
Automatic partner ID
Automatic referral code
Automatic referral link
Working referral tracking
Working products
Working cart
Working demo checkout
Working orders
Working commission engine
Working partner dashboard
Working admin dashboard
Working payout workflow
Working reports
Working demo data

Where real third-party credentials are required, use DEMO/MOCK mode but keep the production integration architecture ready.

After building, show:

Project structure
Database schema
All routes/pages
Admin credentials for demo
Partner credentials for demo
Demo test flow
Required environment variables
Deployment instructions
Remaining tasks that require real API keys
Any limitations

Before considering the project complete, test the complete flow:

₹199 Membership
→ Partner Registration
→ OTP
→ Demo Payment
→ Partner Activation
→ Automatic Partner ID
→ Automatic Referral Code
→ Automatic Referral Link
→ Referral Click
→ Customer Registration
→ Product
→ Cart
→ Demo Order
→ Commission Calculation
→ Partner Dashboard
→ Payout Request
→ Admin Approval
→ Reports

The system must be designed as a real scalable business application, not just a static demo website.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/42d00ca1-88f0-4b5e-9ade-4cb443e576c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
