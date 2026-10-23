# Deployment

The app deploys on Vercel from `SimpsonLWH/eultc-website`. Production tracks
`main`; every pull request gets its own preview deployment.

## Environments

| Environment | URL | Database | Notes |
| --- | --- | --- | --- |
| Production | https://eultc-website.vercel.app | Atlas cluster, database `prod` | Deploys on every merge to `main`. |
| Preview | Per-PR URL from Vercel | Atlas cluster, database `dev` | Created automatically for pull requests. |
| Local | http://localhost:3000 | Any local mongod (`docker compose up -d mongo`), database `dev` | Populate with `npm run db:seed`. |

## Environment variables

| Variable | Required | Source | Applies to |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas console (connection string) | Production scope uses the `prod` database; preview scope and local `.env.local` use `dev`. |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` | Production and preview Vercel scopes, plus `.env.local` locally. |
| `AUTH_DEV_LOGIN` | No | Set to `true` to enable credentials sign-in | Vercel Preview only. Local development enables it automatically; Production ignores it. |

Set values in the Vercel project settings (Settings -> Environment Variables),
scoped to production and preview separately. Never commit `.env.local`;
`.env.example` documents the shape.

## Runtime and checks

- Node.js 24.x on Vercel, matching `.nvmrc` (the single source of truth for
  CI, Vercel and local development).
- GitHub Actions runs on every pull request and push to `main`: `npm ci`,
  `npm run lint`, `npm test`, `npm run build`. The `ci` check is required on
  `main` (see CONTRIBUTING.md).
- Secrets live in Vercel and local `.env.local` only; CI needs no secrets
  because the build runs without a database.

## Verifying a deployment

- `GET /api/health` returns `{"ok":true,"database":"connected"}` when the app
  can reach MongoDB.
- `GET /api/rankings` returns JSON from the seeded database.
- Data-backed pages (for example /fixtures and /availability) stream a static
  shell first. If the shell stays an empty skeleton, check the database
  connection before anything else.
- Response headers include a Content Security Policy, clickjacking protection
  and MIME sniffing protection across every route.

## Incident log

- **2026-10-14: production database unreachable.** The production
  `MONGODB_URI` was dropped from the Vercel environment, so data pages stayed
  on their skeleton shell and `/api/rankings` returned 503. Recovery: restore
  the variable from the Atlas connection string (production scope). The health
  check above is the first triage step for the next occurrence.
