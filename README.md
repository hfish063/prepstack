# PrepStack

## About

Many computer science students face significant hurdles entering the job market because academic coursework rarely replicates the high-pressure, nuanced environment of technical interviews. This application aims to bridge that gap by providing a full-fledged, real-time interview simulation that evaluates both programmatic problem-solving and critical communication skills, moving far beyond the scope of a standard "chatbot".

## Architecture

This is a mono-repo with two apps:

- **`frontend/`** — Next.js (React 19) app, using [Clerk](https://clerk.com) for authentication.
- **`backend/`** — FastAPI app, using SQLModel + Alembic on Postgres for persistence, Clerk for auth verification, and the OpenAI API for interview generation.

The frontend talks to the backend's `/api` routes; the backend talks to Postgres and OpenAI.

## Prerequisites

- Python 3.14+
- Node.js 20+
- Docker (for a local Postgres instance)
- A [Clerk](https://clerk.com) account and application
- An [OpenAI](https://platform.openai.com) API key

## Setup

### 1. Database

Start a local Postgres instance:

```bash
docker run --name prepstack -e POSTGRES_PASSWORD=password -e POSTGRES_DB=prepstack -p 5432:5432 -d postgres
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and fill in:

- `DATABASE_URL` — connection string for the Postgres instance above (defaults match the `docker run` command)
- `CLERK_SECRET_KEY` — from your Clerk dashboard
- `OPENAI_API_KEY` — from your OpenAI account

Apply the database migrations:

```bash
alembic upgrade head
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with your Clerk keys (see the [Next.js quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Running the Application

From `backend/` (with the virtualenv activated):

```bash
fastapi dev app/main.py
```

From `frontend/`:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000` and the backend API at `http://localhost:8000`.
