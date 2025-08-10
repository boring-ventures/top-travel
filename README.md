# Top Travel

Travel site with a lightweight CMS. Built with modern Next.js and a secure, typed backend.

## Tech Stack

- Next.js 15.1.7 (App Router)
- React 19
- Tailwind CSS + shadcn/ui
- Prisma 6.4.0 + PostgreSQL
- Supabase (Auth + Storage)
- React Query 5, Zod 3

## Quick Start

1. Prerequisites

- Node.js 20+
- PostgreSQL (local) or a Supabase project

2. Clone

```bash
git clone https://github.com/Figuu/top-travel.git
cd top-travel
```

3. Environment

Copy and edit environment variables:

```bash
cp .example .env.local
```

Important keys to set in `.env.local`:

- DATABASE_URL: pooled connection string for runtime
- DIRECT_URL: direct connection for Prisma migrations
- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET
- NEXT_PUBLIC_APP_URL (e.g., http://localhost:3000)
- NEXT_PUBLIC_GA_ID (optional)
- MOCK_SUPERADMIN=true for local CMS access (do not enable in prod)

4. Install

```bash
npm install
```

5. Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

6. Develop

```bash
npm run dev
```

Visit http://localhost:3000

## Scripts

- dev: start dev server
- build: production build
- start: start production server
- lint: run ESLint
- test: run tests
- prisma:generate, prisma:migrate, prisma:seed

## Project Structure

```
src/
  app/                 # App Router pages and API routes
  components/          # UI and feature components
  lib/                 # Utilities, Prisma, Supabase helpers
  providers/           # React providers (Query, Auth)
  hooks/               # Custom hooks
```

## Deployment Notes

- Configure all env vars in your host. Use pooled `DATABASE_URL` at runtime; use `DIRECT_URL` only for Prisma migrations.
- Set `NEXT_PUBLIC_APP_URL` to your deployed domain.
- If using Supabase Storage for images, ensure `next.config.ts` allows your storage domain in `images.remotePatterns`.

## Security

- Never commit `.env*` files or secrets.
- Admin-only API routes are protected by auth/role checks; the CMS requires SUPERADMIN. Use `MOCK_SUPERADMIN=true` only in local development.

## Links

- Repository: https://github.com/Figuu/top-travel.git
