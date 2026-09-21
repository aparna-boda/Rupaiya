# Rupaiya — Product Requirements Document
**Version:** 3.0  
**Author:** Aparna  
**Status:** Active  
**Last Updated:** 2026-09-17

---

## 1. Problem Statement

Most Indians earning well have no financial literacy. Every existing app assumes you already know what a mutual fund, SIP, or Nifty is. The result: people either park money in savings accounts (losing to inflation) or get talked into bad products by agents with commissions.

There is no tool that:
- Starts from absolute zero ("what even is money growing?")
- Uses real Indian numbers, real Indian instruments
- Feels like talking to a knowledgeable friend, not a textbook
- Is personal — built around your income, your age, your situation

**Rupaiya** fills that gap.

---

## 2. Target User (v1)

**Primary:** RK — 35-year-old data/software engineer, ₹2L/month income, zero savings, zero investments, starting completely from scratch.

**Generalized profile:**
- Age 28–45
- Salaried professional, ₹1–5L/month
- Educated but financially illiterate
- Has disposable income but no investment habit
- Intimidated by finance jargon
- Needs a trusted, plain-spoken guide — not a sales pitch

**Secondary user (admin):** Content editor — updates concepts, investments, and FAQs without deploying code.

---

## 3. Vision

> "The most honest, plain-spoken, personal finance companion for Indian professionals who are starting from zero."

Not a trading app. Not a robo-advisor. Not a course platform.  
A **thinking partner** that teaches you how money works, shows you what YOUR money could become, and answers any question without judgment.

---

## 4. Core User Goals

| Goal | What success looks like |
|------|------------------------|
| Understand how money grows | User can explain compounding, inflation, risk in their own words |
| Know all ways to invest in India | User knows FD vs MF vs stocks vs gold — differences, risks, returns |
| See personal projections | "If I put ₹10k/month for 20 years, I get ₹X" — their numbers, live |
| Ask anything, get a real answer | Conversational AI that knows their profile and speaks plainly |
| Know what to do first | Clear, prioritized first steps — not overwhelming options |
| Keep content fresh (admin) | Editor updates learnings in-app without code changes |

---

## 5. Non-Goals (v1)

- Actual trading or order placement
- Brokerage integration (Zerodha, Groww, etc.)
- Portfolio sync or tracking of existing investments
- Social features, community, leaderboards
- Recommendations with SEBI-registered advisory liability
- Cryptocurrency deep-dives
- Tax filing or CA-level advice
- End-user login or accounts (profile stays in localStorage)
- Multi-admin roles or audit logs (single password-protected admin only)

---

## 6. Screens — All 8

### Screen 1 — Onboarding
> First launch only. 4 questions. Sets up personal numbers and learning path.

- Age input
- Monthly income input
- Monthly investment capacity input
- Risk appetite selection (`safe` | `low` | `medium` | `high`) — shapes Learning screen priorities
- Stored locally in `localStorage` (no end-user login)
- Never shown again after first completion

### Screen 2 — Home / Dashboard
> The hub. Your snapshot the moment you open the app.

- Big projection number (personalised)
- Age badge + monthly investment badge
- Quick nav cards to all other screens
- No scrolling — everything visible at once

### Screen 3 — Grow Money
> All ways to invest in India. Risk graded. Your projections per option.

- Investment cards loaded from Supabase (`GET /api/investments`)
- Each card: risk grade (colour coded), return range, YOUR projected amount
- Tap to expand: rich-text explanation, year-by-year projection, meta tags
- "Ask about this" button → opens Ask Anything pre-filled

### Screen 4 — Calculator
> Play with numbers freely. Live updates.

- Monthly investment slider + input
- Years slider (1–30)
- Expected return rate selector (preset options + custom)
- Output: total value, total invested, total earned, multiplier
- Year-by-year growth chart
- All numbers tied to user's profile as defaults

### Screen 5 — Learning (`/learning`)
> 159 core concepts in 15 categories. Explained like a friend. Real Indian examples.

- Route `/learning` (redirect from legacy `/basics`)
- Content from `GET /api/knowledge` — `groups` + `concepts` with `groupSlug`
- **Category card grid** — 15 groups (Money Fundamentals, Saving, Mutual Funds, etc.)
- **Risk-based learning path** — onboarding captures `riskAppetite`; Learning screen shows prioritized "Start here / Core / Build next / Learn later" per profile
- Each concept: rich-text explanation + personalised example (`exampleKey` or `default`)
- Cross-links to related investments
- No lessons, no modules, no quizzes

### Screen 6 — Ask Anything
> AI chat. Knows your profile and the live knowledge base.

- Starter questions loaded from Supabase (`GET /api/faqs`)
- Full conversation in session
- AI receives user profile + full knowledge snapshot from DB
- Responses under 200 words unless asked for more
- "Ask about this" from Grow Money lands here pre-filled

### Screen 7 — My Plan
> Personalised step-by-step plan. Built for you, not generic.

- AI generates a plan based on user profile + knowledge base
- Step-by-step action items with amounts, instruments, why
- Regenerate button
- Links to relevant Grow Money cards and Learning concepts

### Screen 8 — Admin / Knowledge Editor (`/admin`)
> Password-protected CMS for all learning content. Not in bottom nav.

**Access:**
- Route: `/admin`
- Login screen: single shared password (env var `ADMIN_PASSWORD`)
- Session: JWT stored in `sessionStorage`, expires after 8 hours
- No link in bottom nav — URL known to editors only (optional subtle link on Home for dev)

**Tabs:**

| Tab | What you edit |
|-----|---------------|
| Concepts | Title, tagline, rich-text explanation, example key, group, keywords, related investments, sort order, publish toggle |
| Investments | Name, tagline, icon, risk grade/label, return min/max/avg (number fields), rich-text explanation, highlights, keywords, related concepts, sort order, publish toggle |
| FAQs | Question text, category, related links, sort order, publish toggle |
| Meta | Learning intro, Grow Money intro, app copy snippets |

**Editor UX:**
- **Rich text** (TipTap): bold, italic, links, bullet lists — for all `explanation` fields
- **Number fields**: return percentages, risk grade (0–4), sort order
- **Tag inputs**: keywords, highlights
- **Relation pickers**: link concepts ↔ investments (dropdowns, not raw IDs)
- **Save** → `PUT /api/admin/...` → writes to Supabase immediately
- **Preview** button opens Grow Money or Learning in new tab with draft (optional v1.1)

**Actions bar:**
- Save changes
- Discard unsaved edits
- View published site

---

## 7. Design System

(Unchanged from v2.0 — see sections 7.1–7.4 below)

### 7.1 Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#FEFEFE` | App background — pure warm white |
| Card | `#F5F5F2` | All cards, surfaces |
| Sunken | `#EEEEED` | Input backgrounds, chat bar |
| Border | `#E0DDD8` | All borders, dividers |
| Pistachio (primary) | `#7FAF72` | Big numbers, active tabs, buttons, user messages |
| Pistachio dark | `#4A7A3A` | Hover states, pressed states |
| Pistachio light | `#B8D8B0` | Subtle highlights |
| Pistachio soft | `#E8F5E0` | Zero-risk badges, safe backgrounds |
| Mauve (secondary) | `#C4AECE` | AI messages, concept tags, secondary highlights |
| Mauve dark | `#7A5A88` | Mauve text on light backgrounds |
| Mauve soft | `#F2EBF8` | AI chat bubbles, concept card backgrounds |
| Ink | `#1A1A18` | Primary text |
| Secondary | `#555550` | Secondary text |
| Muted | `#888880` | Supporting text, labels, meta |
| Hint | `#C8C8C0` | Placeholder text |

### 7.2 Risk Scale Colours

| Risk Level | Background | Text | Usage |
|-----------|-----------|------|-------|
| Zero risk | `#E8F5E0` | `#3A6A28` | Savings account, liquid funds |
| Low | `#F5EED8` | `#7C5A00` | FD, RD, PPF |
| Medium | `#F5E5D0` | `#8C4010` | Mutual funds, gold |
| High | `#F5D8D8` | `#8C2010` | Direct stocks, sector funds |
| Very High | `#F0D0D0` | `#7C1010` | Small caps, crypto, F&O |

### 7.3 Typography
- Font: `DM Sans` (Google Fonts)
- Weights: 400 (regular), 500 (medium), 700 (bold — numbers only)
- Hero numbers: 38–42px, weight 700, letter-spacing -1.5px
- Body: 14px, weight 400, line-height 1.6
- Labels/meta: 11–12px, weight 400–500
- Rich text rendered content: same 14px body styling, links in `--color-primary`

### 7.4 Layout
- Mobile-first: max-width 480px centered (admin editor may use full width on desktop)
- Bottom navigation bar (5 items: Home, Grow, Calculate, Ask, Plan) — Learning via Home card; admin excluded
- Consistent padding: 20px horizontal, 16px vertical
- Card border-radius: 14px
- Button border-radius: 10px
- Pill border-radius: 20px

---

## 8. Technical Architecture

```
rupaiya/
├── frontend/
│   └── src/
│       ├── pages/                  # 8 screens (+ AdminLogin, KnowledgeAdmin)
│       ├── components/
│       │   ├── admin/              # RichTextEditor, ConceptForm, InvestmentForm, FaqForm
│       │   ├── ui/
│       │   ├── layout/
│       │   └── features/
│       ├── hooks/
│       │   ├── useKnowledge.ts     # Fetch + cache content from API
│       │   └── useAdminAuth.ts     # Admin session management
│       ├── store/
│       └── api/
│           └── client.ts           # All API calls incl. admin CRUD
│
├── backend/
│   └── app/
│       ├── routes/
│       │   ├── chat.py
│       │   ├── plan.py
│       │   ├── calculator.py
│       │   ├── knowledge.py        # Public read endpoints
│       │   └── admin.py            # Password-protected write endpoints
│       ├── services/
│       │   ├── claude.py           # Loads KB from Supabase at request time
│       │   ├── calculator.py
│       │   ├── supabase.py         # Supabase client wrapper
│       │   └── seed.py             # One-time default content loader
│       └── models/
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # All tables + RLS policies
│   └── seed/
│       ├── concepts.json           # Default content (source for seed script)
│       ├── investments.json
│       ├── faqs.json
│       └── meta.json
│
├── .github/workflows/deploy.yml
├── CLAUDE.md
└── README.md
```

### Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + TypeScript | Type safety, component reuse |
| Styling | Tailwind CSS + CSS tokens | Utility-first, design tokens |
| Rich text editor | TipTap | Lightweight, React-native, outputs HTML |
| State | Zustand | Lightweight, no boilerplate |
| Routing | React Router v6 | Standard, simple |
| HTTP Client | Axios | Interceptors, admin auth header |
| Build | Vite | Fast HMR, modern bundler |
| Backend | Python FastAPI | Async, type-safe, Pydantic |
| Database | **Supabase (PostgreSQL)** | Managed Postgres, REST + Python client |
| AI | Anthropic Claude SDK | claude-sonnet-4-6 |
| Deployment | Vercel (frontend + backend) | Free tier, zero-config |
| Version Control | GitHub | Standard |

### Content flow

```
Supabase DB  →  FastAPI (read/write)  →  React app
                    ↓
              Claude system prompt
              (full KB injected at request time)
```

**Rule:** No learning content hardcoded in frontend or backend Python files.  
All concepts, investments, FAQs, and meta copy come from Supabase via API.  
The `supabase/seed/` JSON files are used **once** at setup only — not at runtime.

---

## 9. Supabase Schema

### 9.1 `concept_groups` (migration `002_concept_groups.sql`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `slug` | `text` UNIQUE NOT NULL | e.g. `money-fundamentals` |
| `title` | `text` NOT NULL | e.g. `Money Fundamentals` |
| `description` | `text` NOT NULL | Category subtitle |
| `sort_order` | `int` NOT NULL DEFAULT 0 | Display order on Learning screen |
| `is_published` | `boolean` NOT NULL DEFAULT true | |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | Auto-updated on save |

15 groups: Money Fundamentals, Saving, Investing Basics, Mutual Funds, Government Schemes, Fixed Income, Stocks, Gold, Real Estate, Tax Basics, Insurance, Retirement Planning, Behavioural Finance, Advanced Investing, Financial Planning.

### 9.2 `concepts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `slug` | `text` UNIQUE NOT NULL | e.g. `compounding` |
| `title` | `text` NOT NULL | |
| `tagline` | `text` NOT NULL | |
| `explanation` | `text` NOT NULL | Rich HTML from TipTap |
| `example_key` | `text` NOT NULL | `compounding` \| `inflation` \| `riskReturn` \| `sip` \| `diversification` \| `default` |
| `group_slug` | `text` | FK to `concept_groups.slug` (nullable for legacy rows) |
| `sort_order` | `int` NOT NULL DEFAULT 0 | Display order within curriculum |
| `is_published` | `boolean` NOT NULL DEFAULT true | Draft support |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | Auto-updated on save |

**159 concepts** seeded from `supabase/seed/build_concepts.py` → `concepts.json`.

### 9.3 `investments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE NOT NULL | e.g. `mutual-funds` |
| `name` | `text` NOT NULL | |
| `tagline` | `text` NOT NULL | |
| `icon` | `text` NOT NULL | Single emoji |
| `risk_grade` | `smallint` NOT NULL CHECK (0–4) | |
| `risk_label` | `text` NOT NULL | e.g. `Medium` |
| `return_min` | `numeric(5,2)` NOT NULL | Percentage |
| `return_max` | `numeric(5,2)` NOT NULL | Percentage |
| `return_avg` | `numeric(5,2)` NOT NULL | Used for projections; 0 = no projection |
| `explanation` | `text` NOT NULL | Rich HTML |
| `sort_order` | `int` NOT NULL DEFAULT 0 | |
| `is_published` | `boolean` NOT NULL DEFAULT true | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### 9.4 `investment_highlights`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `investment_id` | `uuid` FK → `investments.id` ON DELETE CASCADE | |
| `label` | `text` NOT NULL | e.g. `No lock-in` |
| `sort_order` | `int` NOT NULL DEFAULT 0 | |

### 9.5 `keywords`

Polymorphic keyword index for search and AI context.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `entity_type` | `text` NOT NULL | `concept` \| `investment` |
| `entity_id` | `uuid` NOT NULL | FK polymorphic (enforced in app layer) |
| `keyword` | `text` NOT NULL | Lowercase on insert |

Index: `(entity_type, entity_id)`

### 9.6 `content_relations`

Many-to-many links between concepts and investments.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `concept_id` | `uuid` FK → `concepts.id` ON DELETE CASCADE | |
| `investment_id` | `uuid` FK → `investments.id` ON DELETE CASCADE | |
| UNIQUE | `(concept_id, investment_id)` | |

### 9.7 `faqs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE NOT NULL | |
| `question` | `text` NOT NULL | Shown as Ask Anything chip |
| `category` | `text` NOT NULL | `getting-started` \| `instruments` \| `concepts` \| `practical` |
| `sort_order` | `int` NOT NULL DEFAULT 0 | |
| `is_published` | `boolean` NOT NULL DEFAULT true | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### 9.8 `faq_relations`

Optional links from FAQs to concepts/investments (for admin reference, future deep-linking).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `faq_id` | `uuid` FK → `faqs.id` ON DELETE CASCADE | |
| `entity_type` | `text` NOT NULL | `concept` \| `investment` |
| `entity_id` | `uuid` NOT NULL | |

### 9.9 `content_meta`

Key-value store for screen intros and app copy.

| Column | Type | Notes |
|--------|------|-------|
| `key` | `text` PK | e.g. `basics_intro_title` |
| `value` | `text` NOT NULL | |
| `updated_at` | `timestamptz` | |

Default keys:
- `basics_intro_title`, `basics_intro_description`
- `grow_intro_title`, `grow_intro_description`
- `knowledge_version` — incremented on each admin save (cache busting)

### 9.10 `seed_log`

Tracks one-time seed execution. Prevents re-seeding on redeploy.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `seed_name` | `text` UNIQUE NOT NULL | e.g. `initial_v2` |
| `seeded_at` | `timestamptz` NOT NULL | |
| `row_counts` | `jsonb` NOT NULL | `{ concepts: 5, investments: 6, ... }` |

### 9.10 Row Level Security (RLS)

| Table | Public read | Admin write |
|-------|-------------|-------------|
| All content tables | `is_published = true` via anon key | Service role key from FastAPI only |
| `seed_log` | No public access | Service role only |

Public reads go through **FastAPI**, not direct Supabase client from browser (keeps service key secret).  
Frontend never holds the Supabase service role key.

---

## 10. API Design

### 10.1 Public — Knowledge (read-only)

All content endpoints return published records only, ordered by `sort_order`.

```
GET /api/knowledge
Response: {
  meta: { basicsIntro: {...}, growIntro: {...}, version: "3" },
  groups: [{ id, slug, title, description, sortOrder }],
  concepts: [{ id, slug, title, tagline, explanation, exampleKey, groupSlug, relatedInvestmentIds, keywords, sortOrder }],
  investments: [{ id, slug, name, ..., highlights: [...], relatedConceptIds, keywords }],
  faqs: [{ id, slug, question, category }]
}
```

```
GET /api/concepts
GET /api/concepts/{slug}

GET /api/investments
GET /api/investments/{slug}

GET /api/faqs

GET /api/meta
```

### 10.2 Admin — Auth

```
POST /api/admin/login
Body: { password: string }
Response: { token: string, expiresAt: string }
Error 401: Invalid password
```

```
POST /api/admin/logout
Header: Authorization: Bearer {token}
```

All admin routes require `Authorization: Bearer {token}`.

### 10.3 Admin — CRUD

```
GET    /api/admin/concepts              # All incl. unpublished
POST   /api/admin/concepts              # Create
PUT    /api/admin/concepts/{id}         # Update (full replace)
DELETE /api/admin/concepts/{id}         # Soft delete → is_published = false

GET    /api/admin/investments
POST   /api/admin/investments
PUT    /api/admin/investments/{id}      # Includes highlights array
DELETE /api/admin/investments/{id}

GET    /api/admin/faqs
POST   /api/admin/faqs
PUT    /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}

PUT    /api/admin/meta                  # Batch update meta keys
```

On every successful admin write:
1. Update `content_meta.knowledge_version` (increment)
2. Update `updated_at` on affected row
3. Sync `keywords` and `content_relations` junction tables

### 10.4 AI endpoints (updated)

```
POST /api/chat
Body: {
  message: string,
  history: [{ role, content }],
  userProfile: UserProfile
}
```
Backend loads full knowledge snapshot from Supabase before calling Claude.  
No knowledge payload required from frontend.

```
POST /api/plan
Body: { userProfile: UserProfile }
```
Same — knowledge loaded server-side from DB.

```
POST /api/calculate/sip
Body: { monthly, ratePercent, years }
Response: { totalValue, totalInvested, totalGain, multiplier, yearlyBreakdown }
```
Unchanged — pure math, no DB.

### 10.5 Seeding

```
POST /api/admin/seed
Header: Authorization: Bearer {token}
Body: { force: false }          # force=true re-seeds even if seed_log exists
Response: { seeded: true, counts: {...} }
```

**Setup flow (once per environment):**
1. Run Supabase migrations (`001_initial_schema.sql`, then `002_concept_groups.sql`)
2. Set env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`
3. Call `POST /api/admin/seed` OR run `python -m app.services.seed` CLI
4. Seed script reads `supabase/seed/*.json` (including `concept_groups.json`), inserts all rows, writes `seed_log`
5. If `seed_log.initial_v2` exists → skip (unless `force=true`)

---

## 11. User Profile Schema

```typescript
interface UserProfile {
  age: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  riskAppetite: 'safe' | 'low' | 'medium' | 'high';
  onboardingComplete: boolean;
}
```

Stored in `localStorage` in v1. **Not** in Supabase. No end-user login.

---

## 12. AI System Prompt

Claude receives the user profile **plus the full published knowledge base** loaded from Supabase at request time:

```
You are a friendly, plain-spoken personal finance guide for Indian markets.

User profile: {age}, ₹{monthlyIncome}/month income, ₹{monthlyInvestment}/month to invest.

## Knowledge Base (use this — do not contradict it)
{concepts + investments injected from DB}

Rules:
- Speak like a knowledgeable friend, not a textbook
- Always use Indian context: INR, NSE/BSE, SEBI, Nifty, real Indian examples
- Use real numbers tied to the user's profile
- Never use jargon without immediately explaining it in plain terms
- Keep responses under 200 words unless asked for more detail
- Never say "great question" or start with sycophantic openers
- Be honest about risks and downsides
- Goal: make them genuinely understand how a rupee earns another rupee
```

---

## 13. Seeding — Default Content

Default content lives in `supabase/seed/` (migrated from the original `knowledge/` JSON files):

| File | Rows |
|------|------|
| `concept_groups.json` | 15 categories |
| `concepts.json` | 159 concepts (generate via `build_concepts.py`) |
| `investments.json` | 6 investments + highlights |
| `faqs.json` | 6 starter questions |
| `meta.json` | Screen intros |

Seeding is **idempotent** — safe to call on every deploy; skips if `seed_log` entry exists.

---

## 14. Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

### Backend (`.env`)
```
ANTHROPIC_API_KEY=your_key_here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=random_secret_for_admin_tokens
ENVIRONMENT=development
```

---

## 15. Risk Grading Framework

| Grade | Label | Return Range | Examples |
|-------|-------|-------------|----------|
| 0 | Zero Risk | 3–4% | Savings account, liquid funds |
| 1 | Very Low | 6–8% | FD, RD, PPF, Gold/SGBs |
| 2 | Medium | 8–15% | Mutual funds, index funds |
| 3 | High | 0–30% | Direct stocks |
| 4 | Very High | Variable | Crypto, small caps, F&O |

---

## 16. Open Questions

- [ ] PWA support for mobile app-like install experience?
- [ ] Streaming AI responses or full response at once?
- [ ] Which NSE/BSE data API for Phase 2 — free tier limitations?
- [ ] Admin preview of unpublished drafts on live screens?
- [ ] Content version history / rollback in Supabase?

---

## 17. Milestones

| Milestone | Scope | Target |
|-----------|-------|--------|
| M1 — PRD + Repo | This PRD, GitHub repo, project scaffold | Week 1 |
| M2 — Design tokens + components | CSS tokens, Button, Card, Badge, BottomNav | Week 1 |
| M3 — Onboarding + Home | Screens 1 & 2, localStorage profile | Week 2 |
| M4 — Grow Money + Calculator | Screens 3 & 4, SIP math | Week 2 |
| M5 — Learning | Screen 5, 159 concepts in 15 categories, risk-based path | Week 3 |
| M6 — Backend + AI Chat | FastAPI, Claude SDK, Ask Anything | Week 3 |
| M7 — My Plan | AI-generated personalised plan | Week 4 |
| M8 — Supabase + Knowledge API | Schema, migrations, seed script, public read endpoints | Week 4 |
| M9 — Admin UI | Screen 8, TipTap editor, admin CRUD, password auth | Week 5 |
| M10 — Polish + Deploy | Remove all hardcoded content, cache busting, Vercel | Week 5–6 |
