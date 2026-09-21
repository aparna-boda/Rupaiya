# Rupaiya

A personal finance companion for Indian professionals starting from zero — learn, calculate, and plan how your money grows.

## Quick start

### 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in SQL Editor (in order):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_concept_groups.sql`
3. Copy project URL and service role key

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

### 3. Seed default content (once)

```bash
# After backend is running and admin password is set:
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_ADMIN_PASSWORD"}'

# Use returned token:
curl -X POST http://localhost:8000/api/admin/seed \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"force": false}'

# Or via CLI:
python -m app.services.seed
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

- App: http://localhost:5173
- Admin: http://localhost:5173/admin

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + TipTap |
| Backend | FastAPI |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude |

All learning content lives in **Supabase** and is served via API:
- **159 concepts** in **15 categories** (Money Fundamentals, Saving, Mutual Funds, etc.)
- **6 investments**, **6 FAQ chips**, screen intro copy

The admin UI at `/admin` lets you edit content with rich text — no code deploys needed.

Regenerate concept seed from blueprint: `python supabase/seed/build_concepts.py`

## Screens

1. Onboarding — age, income, investment amount, risk appetite (localStorage)
2. Home — dashboard projection
3. Grow Money — investments from DB
4. Calculator — SIP calculator
5. **Learning** (`/learning`) — 15 category cards, risk-based learning path, 159 concepts
6. Ask Anything — AI chat (KB injected server-side)
7. My Plan — AI-generated plan
8. **Admin** — password-protected knowledge editor

## Environment variables

| Variable | Where |
|----------|-------|
| `VITE_API_URL` | frontend/.env |
| `ANTHROPIC_API_KEY` | backend/.env |
| `SUPABASE_URL` | backend/.env |
| `SUPABASE_SERVICE_ROLE_KEY` | backend/.env |
| `ADMIN_PASSWORD` | backend/.env |
| `JWT_SECRET` | backend/.env |

Without Supabase configured, the API falls back to `supabase/seed/*.json` for reads only (admin writes require Supabase).

## Production deploy checklist (Tier 4)

1. **Supabase** — run migrations `001` + `002` in SQL Editor
2. **Backend `.env`** — set all variables in the table above on your host (Vercel/Railway/Fly)
3. **Force seed once** — `POST /api/admin/seed` with `{ "force": true }` after admin login
4. **Frontend** — set `VITE_API_URL` to your production API URL, deploy `frontend/` to Vercel
5. **Verify** — `GET /api/knowledge` returns 15 groups, 159 concepts, **10 investments**
6. **Smoke test** — onboarding → Home health check → Learning search → Generate plan (needs Anthropic key)

GitHub Actions runs `npm run build` + backend import check on push to `main`.
