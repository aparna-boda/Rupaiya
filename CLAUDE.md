# CLAUDE.md — Rupaiya Project Instructions

> This file is the single source of truth for the Rupaiya project.
> Read this before doing anything. Every decision — folder structure, naming,
> colours, tone, component shape — is defined here.

---

## 1. What is Rupaiya?

A personal finance companion for Indian professionals starting from zero.
It answers one question nobody answers clearly: **"How does a rupee earn another rupee?"**

Not a trading app. Not a course platform. Not a robo-advisor.
A warm, plain-spoken thinking partner that teaches you how money works,
shows you what YOUR money could become, and answers any question without judgment.

**Primary user:** RK — 35-year-old data engineer, ₹2L/month income,
₹10,000/month to invest, zero savings, zero investments, starting from scratch.

**Admin user:** Content editor — updates concepts, investments, and FAQs via Screen 8.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties (design tokens) |
| Rich text editor | TipTap (admin only) |
| State | Zustand |
| Routing | React Router v6 |
| HTTP | Axios |
| Build | Vite |
| Backend | Python FastAPI |
| Database | **Supabase (PostgreSQL)** |
| AI | Anthropic Claude SDK (Python) — model: claude-sonnet-4-6 |
| Deployment | Vercel (frontend + backend serverless) |
| Version Control | GitHub |

---

## 3. Folder Structure

Create exactly this structure. Do not deviate.

```
rupaiya/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── styles/
│       │   └── tokens.css          # Design tokens as CSS variables
│       ├── types/
│       │   ├── profile.ts          # UserProfile interface
│       │   ├── investment.ts       # Investment, RiskGrade types
│       │   ├── chat.ts             # Message, ChatHistory types
│       │   └── knowledge.ts        # Concept, FAQ, KnowledgeSnapshot types
│       ├── utils/
│       │   ├── calculator.ts       # SIP, compound interest math
│       │   ├── formatters.ts       # ₹ formatting, Cr/L conversion
│       │   ├── examples.ts         # Personalised concept examples (pure math)
│       │   └── learningPath.ts     # Risk-based learning path priorities
│       ├── api/
│       │   └── client.ts           # Axios instance + all API calls
│       ├── hooks/
│       │   ├── useProfile.ts       # Read/write user profile from localStorage
│       │   ├── useCalculator.ts    # SIP calculation logic
│       │   ├── useChat.ts          # Chat state and API calls
│       │   ├── useKnowledge.ts     # Fetch + cache content from API
│       │   └── useAdminAuth.ts     # Admin JWT session
│       ├── store/
│       │   ├── profileStore.ts     # Zustand: user profile
│       │   └── chatStore.ts        # Zustand: chat history
│       ├── components/
│       │   ├── ui/                 # Primitive components
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Input.tsx
│       │   ├── layout/             # Layout components
│       │   │   ├── BottomNav.tsx
│       │   │   ├── Header.tsx
│       │   │   └── PageWrapper.tsx
│       │   ├── features/           # Feature-specific components
│       │   │   ├── InvestmentCard.tsx
│       │   │   ├── ChatBubble.tsx
│       │   │   ├── ConceptCard.tsx
│       │   │   └── RichTextContent.tsx  # Renders HTML explanations safely
│       │   └── admin/              # Admin-only components
│       │       ├── RichTextEditor.tsx   # TipTap wrapper
│       │       ├── ConceptForm.tsx
│       │       ├── InvestmentForm.tsx
│       │       ├── FaqForm.tsx
│       │       └── RelationPicker.tsx
│       └── pages/                  # One file per screen
│           ├── Onboarding.tsx      # Screen 1
│           ├── Home.tsx            # Screen 2
│           ├── GrowMoney.tsx       # Screen 3
│           ├── Calculator.tsx      # Screen 4
│           ├── Learning.tsx        # Screen 5 (route /learning, redirect from /basics)
│           ├── AskAnything.tsx     # Screen 6
│           ├── MyPlan.tsx          # Screen 7
│           ├── AdminLogin.tsx      # Screen 8 — gate
│           └── KnowledgeAdmin.tsx  # Screen 8 — editor
│
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py                 # FastAPI entry point, CORS, router registration
│       ├── config.py               # Settings, env vars via pydantic-settings
│       ├── routes/
│       │   ├── chat.py             # POST /api/chat
│       │   ├── plan.py             # POST /api/plan
│       │   ├── calculator.py       # POST /api/calculate/sip
│       │   ├── knowledge.py        # GET /api/knowledge, /concepts, /investments, /faqs
│       │   └── admin.py            # Admin auth + CRUD
│       ├── services/
│       │   ├── claude.py           # Anthropic SDK, loads KB from Supabase
│       │   ├── calculator.py       # SIP/compound math (pure Python)
│       │   ├── supabase.py         # Supabase client wrapper
│       │   ├── knowledge.py        # Read published content from DB
│       │   └── seed.py             # One-time default content loader
│       └── models/
│           ├── profile.py          # UserProfile Pydantic model
│           ├── chat.py             # ChatRequest, ChatResponse
│           ├── calculator.py       # CalculatorRequest, CalculatorResponse
│           └── knowledge.py        # Concept, Investment, FAQ Pydantic models
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_concept_groups.sql
│   └── seed/
│       ├── concept_groups.json     # 15 curriculum categories
│       ├── concepts.json           # 159 concepts (generated)
│       ├── build_concepts.py       # Regenerate concepts.json from blueprint
│       ├── investments.json
│       ├── faqs.json
│       └── meta.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── CLAUDE.md                       # This file
├── README.md
└── .gitignore
```

---

## 4. Design System

### 4.1 Colour Tokens

Define these in `frontend/src/styles/tokens.css` as CSS custom properties.
Use these token names everywhere — never hardcode hex values in components.

```css
:root {
  /* Surfaces */
  --color-bg:       #FEFEFE;
  --color-card:     #F5F5F2;
  --color-sunken:   #EEEEED;
  --color-border:   #E0DDD8;

  /* Primary — Pistachio */
  --color-primary:        #7FAF72;
  --color-primary-dark:   #4A7A3A;
  --color-primary-light:  #B8D8B0;
  --color-primary-soft:   #E8F5E0;

  /* Secondary — Light Mauve */
  --color-secondary:       #C4AECE;
  --color-secondary-dark:  #7A5A88;
  --color-secondary-soft:  #F2EBF8;

  /* Text */
  --color-ink:       #1A1A18;
  --color-secondary-text: #555550;
  --color-muted:     #888880;
  --color-hint:      #C8C8C0;

  /* Risk Scale */
  --color-risk-0-bg:   #E8F5E0;  --color-risk-0-text: #3A6A28;
  --color-risk-1-bg:   #F5EED8;  --color-risk-1-text: #7C5A00;
  --color-risk-2-bg:   #F5E5D0;  --color-risk-2-text: #8C4010;
  --color-risk-3-bg:   #F5D8D8;  --color-risk-3-text: #8C2010;
  --color-risk-4-bg:   #F0D0D0;  --color-risk-4-text: #7C1010;

  /* Spacing, Radius, Typography — unchanged */
  --max-width: 480px;
}
```

### 4.2–4.4 Typography, Layout, What NOT to do

(Unchanged — see previous sections. Admin editor may exceed 480px width on desktop.)

---

## 5. TypeScript Types

### profile.ts
```typescript
export interface UserProfile {
  age: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  riskAppetite: 'safe' | 'low' | 'medium' | 'high';
  onboardingComplete: boolean;
}
```

### knowledge.ts
```typescript
export type ConceptExampleKey =
  | 'compounding' | 'inflation' | 'riskReturn' | 'sip' | 'diversification' | 'default';

export interface ConceptGroup {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface Concept {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  explanation: string;        // HTML from DB
  exampleKey: ConceptExampleKey;
  groupSlug?: string;
  relatedInvestmentIds: string[];
  keywords: string[];
  sortOrder: number;
}

export interface Investment {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  riskGrade: 0 | 1 | 2 | 3 | 4;
  riskLabel: string;
  returnMin: number;
  returnMax: number;
  returnAvg: number;
  explanation: string;        // HTML from DB
  highlights: string[];
  relatedConceptIds: string[];
  keywords: string[];
  sortOrder: number;
}

export interface FAQ {
  id: string;
  slug: string;
  question: string;
  category: 'getting-started' | 'instruments' | 'concepts' | 'practical';
  sortOrder: number;
}

export interface KnowledgeSnapshot {
  meta: {
    basicsIntro: { title: string; description: string };
    growIntro: { title: string; description: string };
    version: string;
  };
  groups: ConceptGroup[];
  concepts: Concept[];
  investments: Investment[];
  faqs: FAQ[];
}
```

### chat.ts — unchanged

---

## 6. Screens — Build Specification

### Screens 1–7

Screens 1–7 unchanged in UX. **Critical change:** Screens 3, 5, and 6 load all content from `GET /api/knowledge` — never from hardcoded files or localStorage.

- **Grow Money** — investments from DB; explanations rendered via `<RichTextContent html={...} />`
- **Learning** (`/learning`) — 159 concepts in 15 category groups; card grid UI; risk-based learning path (safe/low/medium/high); explanations via `<RichTextContent />`
- **Ask Anything** — FAQ chips from DB; AI uses DB knowledge server-side

**Onboarding (Screen 1):** 4 steps — age, income, monthly investment, risk appetite (defaults to `safe`).

### Screen 8 — Admin / Knowledge Editor (`/admin`)

**Not in bottom nav.** Password-protected.

**Login (`/admin`):**
- Single password field → `POST /api/admin/login`
- JWT stored in `sessionStorage` as `rupaiya_admin_token`
- Redirect to `/admin/knowledge` on success
- Expired token → redirect back to `/admin`

**Editor (`/admin/knowledge`):**
- Tabs: Concepts | Investments | FAQs | Meta
- List + edit panel layout
- **Rich text** (TipTap) for all `explanation` fields — bold, italic, links, bullet lists only (no images in v1)
- **Number inputs** for: `returnMin`, `returnMax`, `returnAvg`, `riskGrade`, `sortOrder`
- **Text inputs** for: title, tagline, name, icon, slug, question
- **Tag input** for: keywords, highlights
- **Relation picker** for: concept ↔ investment links (dropdowns populated from DB)
- **Publish toggle** per row (`isPublished`)
- Save → `PUT /api/admin/{type}/{id}` → Supabase
- Unsaved changes warning on navigate away

**TipTap config:**
- Extensions: StarterKit (limited), Link
- Output: HTML string stored in `explanation` column
- Placeholder: "Write a plain-language explanation..."
- Toolbar: Bold, Italic, Bullet list, Link — styled with design tokens

---

## 7. Supabase Schema

Tables defined in `supabase/migrations/001_initial_schema.sql` and `002_concept_groups.sql`.

| Table | Purpose |
|-------|---------|
| `concept_groups` | 15 Learning categories (Money Fundamentals, Saving, etc.) |
| `concepts` | Learning screen content (159 concepts, `group_slug` FK to groups) |
| `investments` | Grow Money content |
| `investment_highlights` | Meta pills per investment |
| `keywords` | Search + AI context (polymorphic) |
| `content_relations` | Concept ↔ investment many-to-many |
| `faqs` | Ask Anything starter chips |
| `faq_relations` | FAQ ↔ concept/investment links |
| `content_meta` | Screen intros, cache version key |
| `seed_log` | One-time seed tracking |

**RLS:** Public anon key has no direct table access. All reads/writes go through FastAPI using `SUPABASE_SERVICE_ROLE_KEY`.

**Cache busting:** `content_meta.knowledge_version` increments on every admin save. Frontend passes version to `useKnowledge` — refetch when version changes.

---

## 8. Backend Specification

### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, plan, calculator, knowledge, admin

app = FastAPI(title="Rupaiya API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://rupaiya.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(knowledge.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(plan.router, prefix="/api")
app.include_router(calculator.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")
```

### services/knowledge.py
```python
async def get_published_snapshot() -> dict:
    """Load all published content from Supabase. Called by public API and Claude."""

async def build_knowledge_context() -> str:
    """Format DB content as text block for Claude system prompt."""
```

### services/seed.py
```python
async def run_seed(force: bool = False) -> dict:
    """
    1. Check seed_log for 'initial_v2' — skip if exists and not force
    2. Read supabase/seed/*.json (including concept_groups.json)
    3. Insert concept_groups, concepts (with group_slug), investments, highlights, keywords, relations, faqs, meta
    4. Write seed_log row
    5. Return row counts
    """
```

### services/claude.py
```python
async def chat(message, history, profile) -> str:
    kb_context = await build_knowledge_context()  # from Supabase, not files
    system = SYSTEM_PROMPT.format(...) + kb_context
    ...
```

### AI System Prompt
```python
SYSTEM_PROMPT = """
You are a friendly, plain-spoken personal finance guide for Indian markets.

User profile:
- Age: {age}
- Monthly income: ₹{monthly_income:,}
- Monthly investment capacity: ₹{monthly_investment:,}
- Risk appetite: {risk_appetite}

{knowledge_context}

Rules:
- Speak like a knowledgeable friend, not a textbook or a bank
- Always use Indian context: INR, NSE/BSE, SEBI, SBI, Nifty, real Indian examples
- Use real numbers tied to this user's profile in every response
- Prefer the knowledge base above — do not contradict it
- Never use jargon without immediately explaining it in one plain sentence
- Keep responses under 200 words unless the user explicitly asks for more
- Never say "great question", "certainly", or start with sycophantic openers
- Be honest about risks and downsides — no sales pitch
- Goal: help them understand how a rupee earns another rupee
"""
```

### SIP Calculator — unchanged (pure math, no DB)

---

## 9. API Contracts

### GET /api/knowledge
```json
Response: {
  "meta": {
    "basicsIntro": { "title": "...", "description": "..." },
    "growIntro": { "title": "...", "description": "..." },
    "version": "3"
  },
  "groups": [{ "id", "slug", "title", "description", "sortOrder" }],
  "concepts": [{ ..., "groupSlug": "money-fundamentals" }],
  "investments": [...],
  "faqs": [...]
}
```

### POST /api/admin/login
```json
Request:  { "password": "..." }
Response: { "token": "jwt...", "expiresAt": "2026-09-18T12:00:00Z" }
```

### PUT /api/admin/concepts/{id}
```json
Request: {
  "title": "Compounding",
  "tagline": "The only magic in finance",
  "explanation": "<p>Compounding means...</p>",
  "exampleKey": "compounding",
  "relatedInvestmentIds": ["uuid-..."],
  "keywords": ["compound interest", "growth"],
  "sortOrder": 1,
  "isPublished": true
}
Response: { "ok": true, "version": "4" }
```

### PUT /api/admin/investments/{id}
```json
Request: {
  "name": "Mutual Funds (SIP)",
  "returnMin": 8,
  "returnMax": 15,
  "returnAvg": 12,
  "riskGrade": 2,
  "explanation": "<p>A mutual fund pools...</p>",
  "highlights": ["No lock-in (most)", "LTCG tax after 1 year"],
  "relatedConceptIds": ["uuid-..."],
  "isPublished": true
}
```

### POST /api/admin/seed
```json
Request:  { "force": false }
Response: { "seeded": true, "counts": { "concepts": 5, "investments": 6, "faqs": 6 } }
```

### POST /api/chat — unchanged request shape
Backend loads knowledge from Supabase internally. Frontend does not send knowledge payload.

### POST /api/plan — unchanged request shape
Same — knowledge loaded server-side.

### POST /api/calculate/sip — unchanged

---

## 10. Formatting Utilities — unchanged

---

## 11. Coding Conventions

All previous conventions apply, plus:

- **No hardcoded learning content** — concepts, investments, FAQs, meta copy must come from API/DB
- **Rich HTML explanations** — always render via `<RichTextContent />`, never `dangerouslySetInnerHTML` inline
- **Admin routes** — always check JWT before rendering editor; redirect to `/admin` if missing/expired
- **Seed JSON** — lives in `supabase/seed/` only; never imported at runtime by frontend

---

## 12. Build Order

1. ✅ Design tokens, types, utils, UI primitives, layout
2. ✅ Screens 1–7 (localStorage profile, API-backed content)
3. ✅ Supabase migration + `supabase.py` client
4. ✅ Seed script + 159 concepts / 15 groups in `supabase/seed/`
5. ✅ Public knowledge API (`GET /api/knowledge`)
6. ✅ Screens 3, 5 (Learning), 6 fetch from API
7. ✅ Claude service loads KB from Supabase (JSON fallback when unconfigured)
8. ✅ Admin auth (`POST /api/admin/login`, JWT middleware)
9. ✅ Admin CRUD routes
10. ✅ Screen 8 — AdminLogin + KnowledgeAdmin with TipTap
11. ✅ Learning path by risk appetite; category card UI
12. ⬜ Deploy — Vercel + Supabase prod, run seed once

---

## 13. What NOT to Build

- ❌ No end-user authentication or login (profile stays in localStorage)
- ❌ No real brokerage integration
- ❌ No live market data in v1
- ❌ No portfolio tracker in v1
- ❌ No dark mode
- ❌ No gamification (badges, streaks, points)
- ❌ No social features
- ❌ No trading or order placement
- ❌ No PDF exports
- ❌ No push notifications
- ❌ No hardcoded learning content in frontend or backend Python files
- ❌ No direct Supabase client in frontend (all DB access via FastAPI)

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

### backend/.env.example
```
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
JWT_SECRET=
ENVIRONMENT=development
```

---

## 15. Seeding

**When:** Once per environment, after running migrations.

**How:**
```bash
# Option A — CLI
cd backend && python -m app.services.seed

# Option B — Admin API (after first login)
POST /api/admin/seed  { "force": false }
```

**Source files:** `concept_groups.json`, `concepts.json`, `investments.json`, `faqs.json`, `meta.json`

**Regenerate concepts:** `python supabase/seed/build_concepts.py` (159 concepts from blueprint in `build_concepts.py`)

**Idempotent:** Checks `seed_log` table. Skips if `initial_v2` exists unless `force=true`.

**After seeding:** Verify with `GET /api/knowledge` — should return 15 groups, 159 concepts, 6 investments, 6 FAQs.

**Note:** If Supabase was seeded before groups existed, the API backfills `groups` and missing concepts from seed JSON via `_enrich_with_seed_groups()`.

---

## 16. Git Conventions — unchanged

---

## 17. Disclaimer (include on all projection screens)

> Projections are illustrative, based on historical averages.
> Not SEBI-registered investment advice. Past returns do not guarantee future results.
