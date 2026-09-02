# Homeverse

A production-oriented real estate marketplace built with Next.js App Router, React, Supabase Auth/Postgres/Storage, and role-based customer, agent, and administrator dashboards.

## What is included

- Public property search, filters, responsive cards, galleries, and listing details
- Email/password authentication using server-side Supabase sessions
- Customer favorites, enquiries, and viewing requests
- Agent listing submission, inventory, leads, and schedule
- Admin user/role management and listing moderation
- Postgres migration with RLS, indexes, audit logging, abuse limits, and Storage policies
- Standalone Next.js build, security headers, Docker runtime, and health endpoint
- Demo mode with representative data when Supabase variables are absent

See [docs/PRODUCT_AUDIT.md](docs/PRODUCT_AUDIT.md) for the before/after capability comparison.

## Local development

Requirements: Node.js 22+, npm 10+, and (for the local Supabase stack) Docker.

```bash
npm ci
cp .env.example .env.local
npm run db:start
npm run db:reset
npm run dev
```

Without Supabase environment variables, the app starts in a safe read-through demo mode and exposes the admin workspace so every surface can be reviewed. Set `HOMEVERSE_DEMO_ROLE` to `customer`, `agent`, or `admin` to inspect each navigation model.

## Supabase production setup

1. Create or link a Supabase project.
2. Run `npx supabase db push` to apply `supabase/migrations`.
3. In Auth URL Configuration, set the production Site URL and allow `https://your-domain/auth/callback`.
4. Copy `.env.example` to `.env.local` and populate the project URL and publishable key. Never expose the secret key to the browser.
5. Configure custom SMTP before production email verification or password recovery traffic.

The migration creates all application tables, row-level policies, triggers, indexes, and the `property-media` bucket. New accounts always receive the `customer` role; only an existing administrator can grant elevated access.

Bootstrap the first administrator from the Supabase SQL Editor after that person has registered:

```sql
update public.profiles set role = 'admin' where email = 'owner@example.com';
```

After bootstrap, use the in-app Users & Roles screen for every role change.

## Verification

```bash
npm run typecheck
npm run build
docker build -t homeverse .
```

The container serves the Next.js standalone output as a non-root user and reports readiness at `/api/health`.

## Deployment

Provide these values through the deployment platform’s encrypted environment configuration:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

Build with `npm run build` and run with `npm start`, or deploy the included Dockerfile. Apply database migrations as a separate release step before promoting application code.
