# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Footprint** is a travel photo journaling app. It is two independent apps co-located in this repo:
- `frontend/` — React 19 SPA (Vite, TypeScript, Tailwind v4, shadcn/ui)
- `backend/` — Express 5 API server (TypeScript, Prisma + PostgreSQL, AWS S3, Clerk auth)

Each has its own `node_modules` and `package.json`. There is no root-level package manager.

## Commands

### Frontend (`cd frontend`)
```bash
npm run dev        # Vite dev server on :5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm test           # vitest run (test files: src/**/*.test.{ts,tsx})
```

### Backend (`cd backend`)
```bash
npm run dev        # tsx watch index.ts (hot reload)
npm run start      # tsx index.ts (one-shot)
npx prisma migrate dev   # Run DB migrations
npx prisma generate      # Regenerate client after schema changes
```

### Docker (from root)
```bash
docker-compose up   # Starts postgres + backend + frontend
```

## Architecture

### Auth Flow
Clerk handles auth end-to-end. The frontend wraps the app in `<ClerkProvider>`. The `useAuthToken` hook (`features/auth/`) fetches the JWT and stores it in a module-level variable; an Axios interceptor in `lib/api.ts` attaches it as `Bearer <token>`. The backend uses `@clerk/express` middleware to validate tokens, then `syncUser` middleware upserts the Clerk user into Postgres on every authenticated request.

### Frontend State
- **Redux Toolkit** — slices for trips, photos, uploads, users in `app/store.ts`
- **RTK Query** — `tripsApi` and `tripPhotosApi` wrap the Axios instance via a custom `axiosBaseQuery` (`lib/axiosBaseQuery.ts`)
- **React Router v7** — routes in `App.tsx`; protected routes check Clerk's `<SignedIn>`/`<SignedOut>`

### API Communication
In development, Vite proxies `/api` → `VITE_API_PROXY_TARGET` (default `http://localhost:3000`). In production, `VITE_API_URL` is set to the backend's public URL.

### Backend Routes
All routes are under `/api`. Auth is required on all routes except `GET /api/trips/share/:shareToken`. Route modules:
- `routes/tripRoutes.ts` — CRUD for trips, photo upload/listing per trip, share token generation
- `routes/photoRoutes.ts` — cross-trip photo listing and individual photo ops
- `routes/dashboardRoutes.ts` — stats, on-this-day, upcoming, recent activity

### File Uploads
Multer stores uploads in memory → EXIF parsed via `exifr` (GPS, date extracted) → uploaded to S3 via `@aws-sdk/client-s3`. Photo URLs are S3 presigned URLs. The `s3.service.ts` handles S3 operations.

### Database
Prisma ORM with PostgreSQL. Schema in `backend/prisma/schema.prisma`. Generated client outputs to `backend/generated/prisma`. Three models: `User`, `Trip`, `Photo`. `Trip` has an optional `shareToken` for public share links.

## Environment Variables

**Backend** (`backend/.env`): `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `PORT`, `NODE_ENV`

**Frontend** (`frontend/.env`): `VITE_CLERK_PUBLISHABLE_KEY`, optional `VITE_API_URL` (prod only), optional `VITE_API_PROXY_TARGET` (Docker)

## Frontend Conventions

- **Path alias**: `@/` → `src/`
- **Components**: shadcn/ui (New York style) in `components/ui/`, custom components in `features/`
- **Dark mode**: Dark is the default. Uses `html:not(.light)` selector (not `prefers-color-scheme`). `initTheme()` in `main.tsx` restores saved preference. See `src/lib/theme.ts`.
- **Design tokens**: Tailwind custom colors via CSS variables — `bg-bg-base`, `bg-bg-surface`, `bg-bg-raised`, `text-text-primary`, `text-text-secondary`, `text-text-muted`, `bg-accent` (`#F59E0B` amber static). Defined in `src/index.css` with `@theme inline`.
- **Fonts**: Fraunces (display/serif) + Inter (sans), loaded from Google Fonts in `index.html`
- **Icons**: Lucide React
