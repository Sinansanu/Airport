# Airport

A minimal full-stack setup with a Next.js frontend and a FastAPI backend.

## Project structure

Airport/
 ├─ frontend/       ← Next.js app
 └─ backend/        ← FastAPI API

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python main.py
```

The API will be available at http://localhost:8000.

## Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:3000.

During local development, Next.js proxies `/api/*` to the FastAPI backend via `next.config.mjs` rewrites. Requests from the app should target paths like `/api/flights/list_scheduled_flights`.

## Environment

`frontend/.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

You can also call the backend directly with `fetch("/api/...")` thanks to the rewrite.
