# IntegrateWise Operating System

IntegrateWise OS is the business command center for IntegrateWise. It brings CRM, client delivery, marketing, product catalog, knowledge, and inbound integrations into one Next.js application. The shell describes itself as a single source of truth for the business.

## Stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4, with shadcn/ui components built on Radix
- Supabase for Postgres, Auth, and vector search
- Vercel Analytics, with cron schedules in `vercel.json`
- The Vercel AI SDK (`ai`) for the in-app assistant
- pnpm, with `pnpm-lock.yaml` committed

Clerk webhooks and `scripts/029_clerk_auth_schema.sql` are in the repo for a Clerk-backed user store. The request gate that runs today is Supabase Auth in `proxy.ts`. See [CLERK_SETUP.md](CLERK_SETUP.md) for the Clerk path.

## Run locally

Use Node.js 20.9 or newer.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `proxy.ts` sends visitors without a session to `/auth/login`. **Use Demo Account** on that page sets a `demo_session` cookie for 24 hours and opens `/overview`, so the shell can be explored before Supabase credentials exist.

Live data needs a `.env.local` file. Variable names are listed in [ENV_VARIABLES.md](ENV_VARIABLES.md) and validated in `lib/env.ts`. `.env.local` is gitignored.

```bash
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint
pnpm vault-sync
```

`vault-sync` runs `tools/vault_sync.ts` and expects the `tsx` runner plus `GITHUB_TOKEN`, `GIT_REPO`, and `VAULT_PATH`. It commits an Obsidian vault and pushes it to GitHub.

## Workspace

Pages render inside `components/app-shell.tsx` (sidebar, command search, AI assistant). Navigation is defined in `components/sidebar.tsx`.

| Area | Routes |
| --- | --- |
| Home dashboard | `/` |
| Lightweight workspace | `/overview`, `/tasks`, `/insights`, `/normalize`, `/os` |
| Planning | `/strategy`, `/metrics`, `/brainstorming`, `/website` |
| CRM | `/leads`, `/campaigns`, `/pipeline`, `/deals` |
| Marketing | `/content`, `/campaigns` |
| Catalog and sales | `/products`, `/services`, `/sales` |
| Clients | `/clients`, `/clients/[id]`, `/sessions`, `/projects` |
| Knowledge hub | `/knowledge`, `/knowledge/[category]` |
| Connections | `/data-sources`, `/integrations` |
| Account | `/settings`, `/onboarding`, `/env` |
| Auth | `/auth/login`, `/auth/sign-up`, `/auth/callback` |

The AI assistant posts to `POST /api/ai/chat`. The handler reads `metrics`, `documents`, and `tasks` from Supabase and answers with `openai/gpt-4o-mini`.

Knowledge categories in the sidebar include branding, compliance, credentials, customer support, digital and IT, finance, innovation, investor relations, marketing, metrics, operations, SaaS and tech, sales, startup launch, team and culture, automations, GitHub, product docs, and AI exports.

## Authentication

`proxy.ts` delegates to `updateSession` in `lib/supabase/middleware.ts`.

- A `demo_session=true` cookie skips Supabase. Requests to `/auth/*` in that mode redirect to `/overview`.
- Other requests need a Supabase user. Public paths are `/auth/login`, `/auth/sign-up`, `/auth/sign-up-success`, `/auth/error`, and `/auth/callback`.
- A signed-in user who opens `/auth/*` is sent to `/overview`.

`lib/feature/capabilities.ts` defines six roles (`super_admin`, `org_admin`, `billing_admin`, `ops_manager`, `member`, `viewer`) and capability helpers such as `hasCapability`. The request proxy checks the session cookie and the demo cookie. Wire those helpers in where a route should be limited to a role.

## Database

SQL migrations and seeds live in `scripts/`. Apply them in filename order in the Supabase SQL editor. Prefixes `026` through `029` each have two files; run both.

The scripts create and seed tasks, calendar events, emails, drive files, activities, metrics, documents (pgvector), interactions, webhooks, services, products, CRM tables, brainstorming, the strategic layer, the website manager, Slack and Discord tables, auth, and tenant row-level security.

Home and the data-backed views load those tables through `lib/hooks/use-data.ts`.

## HTTP API

| Path | Purpose |
| --- | --- |
| `POST /api/ai/chat` | Assistant grounded in business data |
| `GET /api/search` | Search |
| `POST /api/capture` | Inbound capture (`GET` reports status) |
| `POST /api/data-sync` | Manual sync (`GET` reports status) |
| `POST /api/hubspot/sync` | HubSpot pull (`GET` reports status) |
| `POST /api/webhook` | Generic webhook intake |
| `POST /api/webhooks/hubspot`, `/asana`, `/slack`, `/discord`, `/clerk`, `/brainstorm` | Provider-specific webhooks. Asana also accepts `GET` |
| `GET /api/webhooks/health` | Webhook health |
| `POST /api/webhooks/[provider]` | Shared verifier for Razorpay, GitHub, Vercel, HubSpot, Todoist, Notion, Asana, and the AI relay (`GET` reports status) |
| `GET /api/integrations/webhooks` | Integration webhook listing |
| `GET /api/cron/daily-insights` | Daily insights, `0 9 * * *` UTC |
| `GET /api/cron/hourly-insights` | Hourly insights |
| `/api/brainstorm/analyze`, `/execute`, `/daily-insights` | Brainstorming layer. The daily route is scheduled hourly in `vercel.json` |
| `POST /api/webhook-scheduler/trigger` | Webhook scheduler |
| `POST /api/website/track` | Website events |
| `/api/auth/me`, `POST /api/auth/logout` | Current user and logout |
| `GET /api/env/health` | Environment health |

## Environment

`lib/env.ts` parses server environment variables with Zod. Supabase public variables fall back to placeholders so the process can boot; dashboards stay empty until real values are set. Server-only secrets stay off the client.

Needed for live data:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Used when the matching feature is turned on:

- `OPENAI_API_KEY`, `EMBEDDING_MODEL_ID` (default `openai-text-embedding-3-small`), `EMBEDDING_DIMENSION` (default `1536`), `VECTOR_DISTANCE_METRIC` (`cosine`, `ip`, or `l2`)
- `CRON_SECRET`, `CRON_ENABLED` (default `true`)
- `CAPTURE_API_SECRET`, `WEBHOOK_API_SECRET`, `BRAINSTORMING_WEBHOOK_SECRET`
- Provider secrets for HubSpot, GitHub, Razorpay, Vercel, Asana, Slack (`SLACK_SIGNING_SECRET`, `SLACK_WEBHOOK_URL`), and Discord (`DISCORD_PUBLIC_KEY`, `DISCORD_WEBHOOK_URL`)
- `CLAUDE_API_KEY` or `DEEPSEEK_API_KEY` for insight jobs that accept more than one model
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `DATABASE_URL`
- Vault sync: `GITHUB_TOKEN`, `GIT_REPO`, `VAULT_PATH`, `GIT_BRANCH`, `GIT_USER_NAME`, `GIT_USER_EMAIL`

Flags in `lib/env.ts`: `AUTO_EXECUTE_LOW_RISK_ACTIONS` defaults to `false`, and `CONTENT_MODERATION_ENABLED` defaults to `true`.

## Repository layout

```
app/            App Router pages and route handlers
components/     App shell, feature views, dialogs, shadcn/ui
hooks/          Client fetch helper
lib/            Env validation, Supabase clients, RBAC, templates, data hooks
scripts/        SQL migrations and seeds
tools/          vault_sync.ts
public/         Icons
proxy.ts        Session gate
vercel.json     Cron schedules
```

`next.config.mjs` leaves image optimization off and allows the production build to proceed when TypeScript reports errors. Treat a green `pnpm build` as a bundle check, and run `pnpm lint` for the lint pass.

## Deploy

Cron entries in `vercel.json`:

- `/api/cron/daily-insights` at 09:00 UTC
- `/api/cron/hourly-insights` every hour
- `/api/brainstorm/daily-insights` every hour

The Vercel project is [v0-integrate-wise-operating-system](https://vercel.com/integratewize/v0-integrate-wise-operating-system). The app was first generated in [v0](https://v0.app/chat/nfzu7dmRmJT); this repository is the Next.js source.

Webhook receivers also record traffic that arrives through `webhooks.integratewise.online`.

## Further reading

- [QUICK_START.md](QUICK_START.md) — local walkthrough and role notes
- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) — modules, tables, and product tiers
- [ARCHITECTURE_PLAN.md](ARCHITECTURE_PLAN.md) — architecture notes
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — environment variable list
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) — release checks
- [CLERK_SETUP.md](CLERK_SETUP.md), [SLACK_DISCORD_SETUP.md](SLACK_DISCORD_SETUP.md), [WEBHOOK_SCHEDULER_SETUP.md](WEBHOOK_SCHEDULER_SETUP.md), [BRAINSTORMING_SETUP.md](BRAINSTORMING_SETUP.md)
- [PROXY_MIGRATION.md](PROXY_MIGRATION.md) — move from `middleware.ts` to `proxy.ts`
