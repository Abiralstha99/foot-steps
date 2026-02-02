# Travel Photo Journal

A travel-focused photo journal that automatically organizes trip photos into a timeline and map-based album, enriched with AI landmark detection.

---

## Tech Stack

| Layer          | Technology                                                                  |
| -------------- | --------------------------------------------------------------------------- |
| **Frontend**   | React 19, Vite, TypeScript, Redux Toolkit, Tailwind CSS, Shadcn UI, Leaflet |
| **Backend**    | Node.js, Express                                                            |
| **Database**   | PostgreSQL, Prisma ORM                                                      |
| **Storage**    | AWS S3 (photo files)                                                        |
| **AI**         | Vision API (landmark detection)                                             |
| **Processing** | exifr (EXIF extraction)                                                     |

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- AWS account (for S3, when implementing uploads)

### 1. Clone and install

```bash
git clone <repo-url>
cd TravelPics
```

### 2. Start PostgreSQL (Docker)

```bash
cp .env.example .env   # Root .env for Docker (POSTGRES_USER, etc.)
docker compose up -d
```

To stop: `docker compose down`. To stop and remove data: `docker compose down -v`.

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit with your DATABASE_URL, AWS keys
npx prisma migrate dev
npx prisma generate
npm run dev
```

Backend runs at `http://localhost:3001` (or port in your config).

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 5. Environment variables

**Backend (`.env`):**

- `DATABASE_URL` — PostgreSQL connection string
- `AWS_ACCESS_KEY_ID` — (when using S3)
- `AWS_SECRET_ACCESS_KEY` — (when using S3)
- `S3_BUCKET` — (when using S3)

---

**Data flow:**

- User creates trips and uploads photos in the frontend.
- Backend receives requests, stores files in S3, saves metadata in PostgreSQL.
- EXIF (date, GPS) is extracted on upload; AI tags are added for landmarks.
- Frontend shows trips in Timeline, Map, and Grid views.
