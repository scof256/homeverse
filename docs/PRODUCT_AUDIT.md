# Homeverse product audit

## Starting point

The inherited project was a polished static marketing page. It had no persistent data, authentication, authorization, listing search, property detail routes, customer workflows, agent tools, admin tools, operational endpoint, or deployment/database setup.

## Production marketplace capability map

| Area | Typical complete product | Added in this branch |
| --- | --- | --- |
| Public discovery | Search, filters, listing pages, verified data, responsive UI | Filtered property directory, detail/gallery pages, real listing links, verification badges |
| Customer | Account, favorites, inquiries, viewing appointments | Supabase Auth SSR, saved homes, enquiry and appointment server actions, customer dashboard |
| Agent | Listing lifecycle, inventory, lead inbox, schedule | Agent-only listing creation/submission, listing statuses, leads and viewing dashboards |
| Administration | User/role controls, listing moderation, audit trail | Admin-only user role management, approve/reject/archive workflow, database audit log |
| Backend | Relational model, object media, authorization, validation | Postgres schema, Storage policies, RLS on every exposed table, Zod server validation |
| Safety | Least privilege, protected roles, abuse controls | New users default to customer, guarded role changes, server-derived ownership, rate limits |
| Operations | Standalone build, health check, documented configuration | Next.js standalone output, security headers, Docker image, `/api/health`, environment template |

## Deliberate boundaries

Payments, contracts, MLS/RESO feed ingestion, address geocoding, and transactional email are integration-dependent and are not simulated. The schema is designed so those services can be added without weakening the core authorization model.
