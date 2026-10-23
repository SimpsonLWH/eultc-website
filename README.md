This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local development

```bash
npm install
cp .env.example .env.local   # add MongoDB and Better Auth values
npm run db:seed              # players, admins, auth accounts and fixtures
npm run dev
```

- The database is MongoDB via Mongoose. Use a MongoDB Atlas free cluster for shared data; any local mongod connection string also works. No Docker required.
- `MONGODB_URI` is read from `.env.local`, which is never committed.
- Local sign-up uses a shared invite plus the temporary paid-email list. Seeded quick-login accounts use `AUTH_DEV_PASSWORD` (default: `eultc-dev-password`).
- For a new production admin, provision the email and print the current invite with `npm run auth:bootstrap -- --email captain@example.com --name "Club Captain"`, then self-register through that link.
- JSON API: `/api/health`, `/api/fixtures?scope=upcoming|past|all`, `/api/fixtures/[fixtureId]`, `/api/rankings`.

## Planning

- V1 execution board: [TASKS.md](TASKS.md) - tickets T01-T13 with dependencies and acceptance criteria.
- Wider club proposal (proposed planning context, not V1 scope): [docs/project-proposal.md](docs/project-proposal.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
