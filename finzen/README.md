# Finzen — AI Finance Manager

A personal finance manager built with Next.js, Prisma, Inngest, and Clerk for authentication. It includes recurring-transaction processing, monthly AI-generated reports, budget alerts, and email notifications.

**Quick summary**
- **Frontend:** Next.js (App Router) + React 19, Tailwind CSS, Radix UI components.
- **Backend:** Next.js server actions / API routes, background jobs using Inngest, ArcJet middleware.
- **Database:** PostgreSQL via Prisma ORM.
- **Authentication:** Clerk (Clerk Next.js SDK) — users stored in Prisma with `clerkUserId`.

Key files:
- Project config: [package.json](package.json)
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma#L1)
- Clerk middleware: [middleware.js](middleware.js#L1)
- Inngest functions: [lib/inngest/functions.js](lib/inngest/functions.js#L1)

---

## Tech stack

- Next.js 15 (App Router) — UI and server-side logic
- React 19
- Tailwind CSS for styling
- Prisma ORM + @prisma/client (PostgreSQL)
- Clerk for authentication and session management
- Inngest for background jobs and cron-like tasks
- ArcJet for bot detection/shielding in middleware
- Resend for transactional emails
- Google Generative AI (Gemini) for generating monthly insights

## What to know about authentication

This project uses Clerk for authentication. The UI uses Clerk components (`SignIn`, `SignUp`) in the `(auth)` routes and the server uses the Clerk server SDK (`auth()` in server actions) and `clerkMiddleware` in [middleware.js](middleware.js#L1) to protect routes.

User records are kept in the local database (PostgreSQL) via Prisma; the `User` model contains a `clerkUserId` field that maps Clerk users to Prisma users. See [prisma/schema.prisma](prisma/schema.prisma#L1).

## Database

Prisma is configured to use PostgreSQL (see `provider = "postgresql"` in [prisma/schema.prisma](prisma/schema.prisma#L1)). The connection is read from the `DATABASE_URL` and `DIRECT_URL` environment variables.

## Running locally (development)

1. Install dependencies:

```bash
npm install
```

2. Set environment variables (example `.env` keys used in this repo):

- `DATABASE_URL` — Postgres connection string (for Prisma)
- `DIRECT_URL` — optional direct DB URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `RESEND_API_KEY` — for sending emails
- `GEMINI_API_KEY` — for Google Generative AI
- `ARCJET_KEY` — for ArcJet middleware

Create a `.env` file in the project root with those keys before proceeding.

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run migrations (development):

```bash
npx prisma migrate dev --name init
```

5. Start the dev server:

```bash
npm run dev
```

6. Open the app at `http://localhost:3000`. Sign in / sign up pages are available at `/sign-in` and `/sign-up`.

## Seeding and utilities

- Seed route: `GET /api/seed` triggers the seed action implemented at `app/api/seed/route.js`.

## Background jobs and scheduled tasks

- Inngest functions are defined in `lib/inngest/functions.js` and include:
	- recurring transaction processing
	- monthly report generation (uses Gemini to produce insights)
	- budget alert checks

These functions expect `GEMINI_API_KEY` (Google Generative AI) and will send emails via Resend.

## Email

Transactional emails are sent using Resend via `actions/send-email.js` — set `RESEND_API_KEY` in the environment.

## Notes and important files

- Prisma models and DB schema: [prisma/schema.prisma](prisma/schema.prisma#L1)
- Server-side database client: [lib/prisma.js](lib/prisma.js#L1)
- Server actions that depend on Clerk auth are under `actions/` (e.g., `accounts.js`, `transaction.js`, `dashboard.js`, `budget.js`).
- Middleware (ArcJet + Clerk): [middleware.js](middleware.js#L1)

## Deployment

When deploying, ensure environment variables are set in the hosting platform and run Prisma migrations (or use `prisma migrate deploy`). For serverless platforms, prefer using `DIRECT_URL` for migrations and `DATABASE_URL` for runtime if needed.

## Where to look next in the codebase

- UI: `app/` and `components/`
- Server actions and business logic: `actions/` and `lib/`
- Background job definitions: `lib/inngest/functions.js`
- Prisma schema: `prisma/schema.prisma`

---

If you'd like, I can:
- run the dev server and verify routes locally,
- add more setup notes (Docker Compose for Postgres), or
- prepare a deployment checklist for Vercel or Fly.io.

README generated from repository analysis.
