# Travel Photo Journal

A travel-focused photo journal that organizes trip photos into a timeline and map-based album, with optional AI landmark tagging.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Redux Toolkit, Tailwind CSS, shadcn/ui, Leaflet |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Storage | AWS S3 |
| Processing | `exifr` |

## Docker Setup (Recommended)

The root `docker-compose.yml` starts 3 services:
- `postgres` on `localhost:5432`
- `backend` on `localhost:3000`
- `frontend` on `localhost:5173`

### 1. Create env files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required values:
- Root `.env`: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `backend/.env`: `DATABASE_URL`, Clerk keys, and optional AWS S3 values
- `frontend/.env`: `VITE_CLERK_PUBLISHABLE_KEY`

For Docker, set backend `DATABASE_URL` to:

```env
DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>
```

### 2. Build and start

```bash
docker compose up --build
```

### 3. Run database migrations

In a second terminal:

```bash
docker compose exec backend npx prisma migrate deploy
```

If you need Prisma Client regeneration manually:

```bash
docker compose exec backend npx prisma generate
```

### 4. Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### 5. Stop containers

```bash
docker compose down
```

Remove containers and database volume:

```bash
docker compose down -v
```