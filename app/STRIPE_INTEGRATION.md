# Stripe Integration (Sandbox)

Complete Stripe Checkout integration for the Fluid AI platform — credit packs, subscriptions, webhooks, and billing history.

---

## Database Schema

### New Models

**`StripeCustomer`**
- `id` — CUID
- `userId` — unique, linked to User
- `stripeCustomerId` — Stripe customer ID

**`PaymentRecord`**
- `id` — CUID
- `userId` — linked to User
- `stripeSessionId` — Stripe Checkout session ID
- `stripePaymentId` — Stripe PaymentIntent ID
- `stripeInvoiceId` — Stripe Invoice ID (for subscriptions)
- `type` — `"credit_pack" | "subscription"`
- `credits` — number of credits granted
- `amount` — price in cents
- `currency` — defaults to `usd`
- `status` — `"pending" | "completed" | "failed" | "refunded"`
- `metadata` — JSON extras

---

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/checkout/session` | Create Stripe Checkout session | Required |
| `POST` | `/api/checkout/webhook` | Stripe webhook handler | Public (signed) |
| `GET`  | `/api/checkout/verify` | Verify session status by `session_id` | Required |
| `GET`  | `/api/billing` | Get payment history + credits | Required |

### `POST /api/checkout/session`

Request body:
```json
{
  "type": "credit_pack" | "subscription",
  "planId": "credits_500" | "plan_creator" | "plan_pro",
  "billingPeriod": "monthly" | "yearly"   // subscriptions only
}
```

Response:
```json
{
  "success": true,
  "data": { "sessionUrl": "https://checkout.stripe.com/..." }
}
```

### `POST /api/checkout/webhook`

Handles:
- `checkout.session.completed` — adds credits, updates `PaymentRecord`
- `invoice.payment_succeeded` — adds recurring subscription credits (skips first invoice)
- `checkout.session.async_payment_failed` / `expired` — marks record as failed

### `GET /api/checkout/verify?session_id=xxx`

Polls Stripe for latest status if record is still pending. Idempotent — safe to call multiple times.

---

## Pricing Config

File: `config/pricing.ts`

```ts
creditPacks = [
  { id: "credits_100",   credits: 100,   priceCents: 500 },
  { id: "credits_500",   credits: 500,   priceCents: 2000 },
  { id: "credits_2000",  credits: 2000,  priceCents: 6000 },
  { id: "credits_5000",  credits: 5000,  priceCents: 12500 },
]

subscriptionPlans = [
  { id: "plan_creator", name: "Creator", credits: 500,  priceCentsMonthly: 900,  priceCentsYearly: 700 },
  { id: "plan_pro",     name: "Pro",     credits: 2000, priceCentsMonthly: 2900, priceCentsYearly: 2400 },
]
```

---

## Pages

| Page | Route | Notes |
|------|-------|-------|
| Pricing | `/pricing` | Credit packs + plans with real Stripe checkout buttons |
| Billing | `/billing` | Payment history, status badges, credit balance |
| Checkout Success | `/checkout/success?session_id=xxx` | Verifies payment, shows credits added |
| Checkout Cancel | `/checkout/cancel` | Friendly cancellation with back links |

---

## Environment Variables

Add to `.env`:

```bash
# Stripe (Sandbox)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## Webhook Setup (Local Dev)

1. Install Stripe CLI
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/checkout/webhook
   ```
4. Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`

---

## Webhook Setup (Production)

1. In Stripe Dashboard → Developers → Webhooks, add endpoint:
   `https://your-domain.com/api/checkout/webhook`
2. Select events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `invoice.payment_succeeded`
3. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Flow

1. User clicks **Buy Now** on `/pricing`
2. Frontend calls `POST /api/checkout/session` (authenticated)
3. Backend creates Stripe Customer if new, then creates Checkout Session
4. Backend creates `PaymentRecord` with status `"pending"`
5. Frontend redirects to Stripe Checkout URL
6. User pays on Stripe
7. Stripe redirects to `/checkout/success?session_id=xxx`
8. Success page polls `GET /api/checkout/verify` (or webhook already processed it)
9. Webhook `checkout.session.completed` fires, adds credits, creates `CreditTransaction`

---

## Build Verification

```bash
npm run build
```

All 27 routes compile successfully. No TypeScript errors.

---

## Files Added / Modified

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Added `StripeCustomer` + `PaymentRecord` models |
| `.env` | Added Stripe env vars |
| `config/pricing.ts` | New — shared pricing config |
| `lib/stripe.ts` | New — Stripe client + `isStripeConfigured()` |
| `app/api/checkout/session/route.ts` | New — checkout session API |
| `app/api/checkout/webhook/route.ts` | New — webhook handler |
| `app/api/checkout/verify/route.ts` | New — verify session API |
| `app/api/billing/route.ts` | New — billing history API |
| `app/pricing/page.tsx` | Modified — integrated Stripe checkout buttons |
| `app/billing/page.tsx` | New — billing history page |
| `app/checkout/success/page.tsx` | New — success page with verify poll |
| `app/checkout/cancel/page.tsx` | New — cancel page |
| `app/components/navbar.tsx` | Modified — added Gallery + Billing links |
| `providers/language-provider.tsx` | Modified — added `nav.gallery` + `nav.billing` translations |
