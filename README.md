# LifeFlow CRM

LifeFlow CRM is a Next.js + TypeScript CRM built for life insurance and final expense sales.

## What this version includes

- Supabase authentication
- Supabase-backed lead, task, and activity storage
- 7-day free trial flow with Stripe checkout
- Billing lockout until a subscription is active or trialing
- Live dashboard, leads, pipeline, tasks, reports, and lead detail page
- Carrier recommendation cards for life insurance workflows

## 1. Install dependencies

```bash
npm install
```

## 2. Add environment variables

Copy `.env.example` to `.env.local` and fill in your values.

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRICE_ID`

## 3. Create your Supabase schema

Open the SQL editor in Supabase and run:

- `supabase/schema.sql`

## 4. Create your Stripe product

Create a recurring product for **$99/month** and set a **7-day trial**.
Use that recurring price ID as `STRIPE_PRICE_ID`.

## 5. Run the app locally

```bash
npm run dev
```

Open `http://localhost:3000`

## 6. Set your Stripe webhook

In Stripe, point your webhook endpoint to:

```text
https://YOUR-DOMAIN/api/stripe/webhook
```

Listen for:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 7. Deploy

Deploy to Vercel and add the same environment variables there.

## Notes

- Carriers are static seed data for now
- Leads, tasks, activity, auth, and billing are live
- Applications are stored as JSON on each lead for fast MVP use
