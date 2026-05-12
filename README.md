# Mister Q Cafe

Production-ready Next.js App Router site for a multi-location pickup-only cafe with Supabase auth/database/storage. Stripe routes are included for later payment activation; the current checkout places pickup orders directly.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project.
3. Run `supabase/schema.sql` in the Supabase SQL editor, then run `supabase/seed.sql`.
4. Create an admin user in Supabase Auth.
5. Copy `.env.local.example` to `.env.local` and fill in Supabase plus `NEXT_PUBLIC_SITE_URL`. Stripe variables can stay empty until you activate payments.
6. Run locally:
   ```bash
   npm run dev
   ```
7. Deploy to Vercel and add the same env variables in Vercel project settings.

## Stripe later

Current checkout saves the order directly and redirects to success. When you are ready for card payments, reconnect `/api/checkout` to Stripe Checkout and configure a Stripe webhook endpoint at:

```text
https://your-domain.com/api/stripe/webhook
```

Listen for `checkout.session.completed`. The webhook marks the matching Supabase order as paid.

## Images

The seed data stores temporary Unsplash image URLs in `menu_items.image_url`. They are placeholders only. Admins can replace each item image from `/admin/menu`; uploads go to the public Supabase Storage bucket named `menu-images`, and the item `image_url` is updated with the Supabase public URL.
