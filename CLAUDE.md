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

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties (design tokens) |
| State | Zustand |
| Routing | React Router v6 |
| HTTP | Axios |
| Build | Vite |
| Backend | Python FastAPI |
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
│       │   └── chat.ts             # Message, ChatHistory types
│       ├── utils/
│       │   ├── calculator.ts       # SIP, compound interest math
│       │   ├── formatters.ts       # ₹ formatting, Cr/L conversion
│       │   └── investments.ts      # Investment data constants
│       ├── api/
│       │   └── client.ts           # Axios instance + all API calls
│       ├── hooks/
│       │   ├── useProfile.ts       # Read/write user profile from localStorage
│       │   ├── useCalculator.ts    # SIP calculation logic
│       │   └── useChat.ts          # Chat state and API calls
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
│       │   └── features/           # Feature-specific components
│       │       ├── InvestmentCard.tsx
│       │       ├── ChatBubble.tsx
│       │       └── ConceptCard.tsx
│       └── pages/                  # One file per screen
│           ├── Onboarding.tsx      # Screen 1
│           ├── Home.tsx            # Screen 2
│           ├── GrowMoney.tsx       # Screen 3
│           ├── Calculator.tsx      # Screen 4
│           ├── Basics.tsx          # Screen 5
│           ├── AskAnything.tsx     # Screen 6
│           └── MyPlan.tsx          # Screen 7
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
│       │   └── calculator.py       # POST /api/calculate/sip
│       ├── services/
│       │   ├── claude.py           # Anthropic SDK wrapper, system prompts
│       │   └── calculator.py       # SIP/compound math (pure Python)
│       └── models/
│           ├── profile.py          # UserProfile Pydantic model
│           ├── chat.py             # ChatRequest, ChatResponse
│           └── calculator.py       # CalculatorRequest, CalculatorResponse
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
  --color-bg:       #FEFEFE;   /* App background — pure warm white */
  --color-card:     #F5F5F2;   /* Cards, elevated surfaces */
  --color-sunken:   #EEEEED;   /* Input backgrounds, chat bar */
  --color-border:   #E0DDD8;   /* All borders and dividers */

  /* Primary — Pistachio */
  --color-primary:        #7FAF72;   /* Buttons, active tabs, big numbers, user messages */
  --color-primary-dark:   #4A7A3A;   /* Hover, pressed states */
  --color-primary-light:  #B8D8B0;   /* Subtle highlights */
  --color-primary-soft:   #E8F5E0;   /* Zero-risk badges, safe pill backgrounds */

  /* Secondary — Light Mauve */
  --color-secondary:       #C4AECE;  /* AI messages, concept tags, secondary highlights */
  --color-secondary-dark:  #7A5A88;  /* Mauve text on light backgrounds */
  --color-secondary-soft:  #F2EBF8;  /* AI chat bubble background, concept card bg */

  /* Text */
  --color-ink:       #1A1A18;  /* Primary text */
  --color-secondary-text: #555550;  /* Secondary text */
  --color-muted:     #888880;  /* Labels, meta, supporting text */
  --color-hint:      #C8C8C0;  /* Placeholder text */

  /* Risk Scale */
  --color-risk-0-bg:   #E8F5E0;  --color-risk-0-text: #3A6A28;  /* Zero risk */
  --color-risk-1-bg:   #F5EED8;  --color-risk-1-text: #7C5A00;  /* Low */
  --color-risk-2-bg:   #F5E5D0;  --color-risk-2-text: #8C4010;  /* Medium */
  --color-risk-3-bg:   #F5D8D8;  --color-risk-3-text: #8C2010;  /* High */
  --color-risk-4-bg:   #F0D0D0;  --color-risk-4-text: #7C1010;  /* Very High */

  /* Spacing */
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   12px;
  --space-lg:   16px;
  --space-xl:   20px;
  --space-2xl:  28px;

  /* Radius */
  --radius-sm:   8px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   20px;
  --radius-pill: 20px;
  --radius-full: 9999px;

  /* Typography */
  --font-family: 'DM Sans', system-ui, sans-serif;
  --font-size-xs:   11px;
  --font-size-sm:   12px;
  --font-size-base: 14px;
  --font-size-md:   15px;
  --font-size-lg:   18px;
  --font-size-hero: 38px;

  /* Max width — mobile first */
  --max-width: 480px;
}
```

### 4.2 Typography

- Font: `DM Sans` — load from Google Fonts
- Weights: 400 (body), 500 (labels, names), 700 (numbers only)
- Hero numbers: `38–42px`, weight `700`, `letter-spacing: -1.5px`
- Body text: `14px`, weight `400`, `line-height: 1.6`
- Labels/meta: `11–12px`, weight `400–500`
- Never ALL CAPS, never decorative fonts

### 4.3 Layout Rules

- Mobile-first: `max-width: 480px`, centered
- Bottom navigation bar — 5 items always visible
- Horizontal padding: `20px` on all pages
- Card padding: `16–20px`
- `border-radius` on cards: `14px`
- `border-radius` on buttons: `10px`
- `border-radius` on pills/badges: `20px`
- All cards have: `border: 0.5px solid var(--color-border)`
- No box shadows — use borders only

### 4.4 What NOT to do — Design

- ❌ No dark backgrounds or dark theme
- ❌ No neon or saturated colours
- ❌ No gradients
- ❌ No box shadows
- ❌ No green/red stock market colour scheme
- ❌ No aggressive reds for "high risk" — use soft terracotta tones
- ❌ No ALL CAPS text
- ❌ No card borders thicker than 1px

---

## 5. TypeScript Types

### profile.ts
```typescript
export interface UserProfile {
  age: number;
  monthlyIncome: number;           // in INR
  monthlyInvestment: number;       // in INR
  riskAppetite: 'safe' | 'low' | 'medium' | 'high';
  onboardingComplete: boolean;
}

export const DEFAULT_PROFILE: UserProfile = {
  age: 35,
  monthlyIncome: 200000,
  monthlyInvestment: 10000,
  riskAppetite: 'medium',
  onboardingComplete: false,
};
```

### investment.ts
```typescript
export type RiskGrade = 0 | 1 | 2 | 3 | 4;

export interface Investment {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  riskGrade: RiskGrade;
  riskLabel: string;
  returnMin: number;     // percentage
  returnMax: number;     // percentage
  returnAvg: number;     // percentage — used for projection
  highlights: string[];
  explanation: string;   // plain language, 2–3 sentences
}
```

### chat.ts
```typescript
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  history: { role: MessageRole; content: string }[];
  userProfile: UserProfile;
}
```

---

## 6. Screens — Build Specification

### Screen 1 — Onboarding (`/onboarding`)

**When shown:** Only on first launch. Check `localStorage` for `rupaiya_profile`.
If `onboardingComplete: true` → redirect to `/home`.

**What's on it:**
- Logo + tagline at top
- 3 steps, one at a time (not all at once):
  - Step 1: "How old are you?" — number input
  - Step 2: "What's your monthly income?" — number input with ₹ prefix
  - Step 3: "How much can you set aside each month?" — number input with ₹ prefix
- Next button between steps, Submit on last step
- Progress dots at bottom (3 dots)
- On submit: save to `localStorage` as `rupaiya_profile`, redirect to `/home`

**Tone of copy:**
- Step 1: "How old are you?" / subtext: "This helps us show projections for YOUR timeline."
- Step 2: "What do you earn monthly?" / subtext: "Rough number is fine. We don't store this anywhere."
- Step 3: "How much can you set aside?" / subtext: "Even ₹500 is a start. You can change this anytime."

---

### Screen 2 — Home (`/home`)

**What's on it:**
- Header: Logo left, profile badge right (age + monthly investment)
- Hero card:
  - Label: "If you start today"
  - Big number: projected corpus at age 60 (SIP at 12%)
  - Sub: "by age 60 · in X years · at 12% avg return"
  - 3 stat pills: total invested | money earned | multiplier
- 4 quick nav cards in a 2×2 grid:
  - Grow Money, Calculator, Basics, My Plan
- Bottom navigation

---

### Screen 3 — Grow Money (`/grow`)

**What's on it:**
- Section title: "Ways a rupee earns another rupee"
- 6 investment cards, stacked vertically
- Each card (collapsed):
  - Icon, name, tagline
  - Risk badge (colour coded by grade)
  - Return range
  - Chevron
- Each card (expanded on tap):
  - Risk meter (5 bars, filled by grade)
  - Plain explanation (2–3 sentences, no jargon)
  - Projection box: "₹10,000/month for 25 years at X% → ₹Y"
  - Meta pills: key facts (lock-in, tax, min amount)
  - "Ask about this →" button → navigates to `/ask` with pre-filled message

**Investment data (use these exactly):**

| # | Name | Risk | Return Avg | Icon |
|---|------|------|-----------|------|
| 1 | Savings Account | 0 — Zero Risk | 3.5% | 🏦 |
| 2 | Fixed Deposit (FD) | 1 — Very Low | 7% | 🔒 |
| 3 | Mutual Funds (SIP) | 2 — Medium | 12% | 📈 |
| 4 | Direct Stocks | 3 — High | 18% | 🏢 |
| 5 | Gold / SGBs | 1 — Very Low | 9% | 🪙 |
| 6 | Crypto | 4 — Very High | 0% (no projection) | ₿ |

---

### Screen 4 — Calculator (`/calculate`)

**What's on it:**
- Monthly investment: slider (₹500 – ₹1,00,000) + text input
- Years: slider (1–30) + label showing target age
- Expected return: button group — 4% / 7% / 9% / 12% / Custom
- Output card (live updates):
  - Total value (big, pistachio)
  - Total invested
  - Total earned
  - Multiplier
- Year-by-year chart: line chart, two lines — "value" vs "invested"
- Defaults: user's profile values

---

### Screen 5 — Basics (`/basics`)

**What's on it:**
- Intro block: "What financial education actually means" — 2 sentences
- 5 concept cards, stacked, expand on tap:
  1. Compounding — "The only magic in finance"
  2. Inflation — "The silent thief"
  3. Risk vs Return — "They always travel together"
  4. SIP — "The lazy person's wealth builder"
  5. Diversification — "Don't bet everything on one thing"
- Each card: plain explanation + real example using user's profile numbers
- No quizzes, no modules, no progress bars

---

### Screen 6 — Ask Anything (`/ask`)

**What's on it:**
- Chat area: scrollable message list
- Opening message from AI (hardcoded, not API):
  "Hey! I'm your finance buddy. You earn ₹{income}/month and you're starting with ₹{investment}/month — that's a solid move at {age}. Ask me anything."
- 6 pre-loaded quick question chips (disappear after first message)
- Text input + send button (sticky at bottom)
- AI responses: light mauve bubble, left aligned
- User messages: pistachio bubble, right aligned
- Calls `POST /api/chat` with full history + user profile

**Pre-loaded questions:**
1. Where should I put my first ₹10,000?
2. What is a mutual fund in simple terms?
3. Is it too late to start at 35?
4. What is Nifty 50?
5. How much risk should I take?
6. How do I open a demat account?

---

### Screen 7 — My Plan (`/plan`)

**What's on it:**
- Header: "Your plan, built for you"
- Sub: "Based on your age, income and ₹{investment}/month"
- Generate button (first time) → calls `POST /api/plan`
- Loading state: "Building your plan..."
- Output: numbered step cards
  - Each step: order number, title, action, amount, instrument, why
  - Colour: alternating pistachio-soft and mauve-soft backgrounds
- Regenerate button at bottom
- Disclaimer: "Illustrative only. Not SEBI-registered advice."

---

## 7. Backend Specification

### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, plan, calculator

app = FastAPI(title="Rupaiya API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://rupaiya.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(plan.router, prefix="/api")
app.include_router(calculator.router, prefix="/api")
```

### AI System Prompt (in `services/claude.py`)
```python
SYSTEM_PROMPT = """
You are a friendly, plain-spoken personal finance guide for Indian markets.

User profile:
- Age: {age}
- Monthly income: ₹{monthly_income:,}
- Monthly investment capacity: ₹{monthly_investment:,}
- Risk appetite: {risk_appetite}

Rules:
- Speak like a knowledgeable friend, not a textbook or a bank
- Always use Indian context: INR, NSE/BSE, SEBI, SBI, Nifty, real Indian examples
- Use real numbers tied to this user's profile in every response
- Never use jargon without immediately explaining it in one plain sentence
- Keep responses under 200 words unless the user explicitly asks for more
- Never say "great question", "certainly", or start with sycophantic openers
- Be honest about risks and downsides — no sales pitch
- Goal: help them understand how a rupee earns another rupee
"""
```

### SIP Calculator (in `services/calculator.py`)
```python
def calculate_sip(monthly: float, rate_percent: float, years: int) -> dict:
    r = rate_percent / 100 / 12
    n = years * 12
    total_value = monthly * ((((1 + r) ** n) - 1) / r) * (1 + r)
    total_invested = monthly * n
    total_gain = total_value - total_invested
    multiplier = total_value / total_invested

    yearly = []
    for y in range(1, years + 1):
        n_y = y * 12
        val = monthly * ((((1 + r) ** n_y) - 1) / r) * (1 + r)
        yearly.append({"year": y, "value": round(val), "invested": monthly * n_y})

    return {
        "totalValue": round(total_value),
        "totalInvested": round(total_invested),
        "totalGain": round(total_gain),
        "multiplier": round(multiplier, 1),
        "yearlyBreakdown": yearly
    }
```

---

## 8. API Contracts

### POST /api/chat
```json
Request:
{
  "message": "What is a mutual fund?",
  "history": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
  "userProfile": {"age": 35, "monthlyIncome": 200000, "monthlyInvestment": 10000, "riskAppetite": "medium"}
}

Response:
{
  "reply": "A mutual fund is..."
}
```

### POST /api/plan
```json
Request:
{
  "userProfile": {"age": 35, "monthlyIncome": 200000, "monthlyInvestment": 10000, "riskAppetite": "medium"}
}

Response:
{
  "steps": [
    {
      "order": 1,
      "title": "Build your emergency fund first",
      "action": "Open a liquid mutual fund account",
      "amount": 3000,
      "instrument": "Liquid Fund (e.g. HDFC Liquid Fund)",
      "why": "Before investing, you need 3-6 months of expenses saved. This is your safety net."
    }
  ]
}
```

### POST /api/calculate/sip
```json
Request:
{ "monthly": 10000, "ratePercent": 12, "years": 25 }

Response:
{
  "totalValue": 18929138,
  "totalInvested": 3000000,
  "totalGain": 15929138,
  "multiplier": 6.3,
  "yearlyBreakdown": [{"year": 1, "value": 127482, "invested": 120000}, ...]
}
```

---

## 9. Formatting Utilities (`utils/formatters.ts`)

```typescript
// Always use these — never format rupees manually in components

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatAge(currentAge: number, years: number): number {
  return currentAge + years;
}

export function formatMultiplier(value: number, invested: number): string {
  return `${(value / invested).toFixed(1)}×`;
}
```

---

## 10. Coding Conventions

- **Components:** Functional only, hooks only — no class components
- **Props:** Always typed with TypeScript interfaces, never `any`
- **Styling:** Tailwind utilities + CSS tokens via `var(--color-*)`. No inline styles except for dynamic values.
- **File naming:** PascalCase for components (`InvestmentCard.tsx`), camelCase for utils/hooks (`useProfile.ts`)
- **Exports:** Named exports for utilities/types, default export for components/pages
- **Error handling:** Always handle API errors — show a user-facing message, never a raw error
- **Loading states:** Every API call needs a loading state — spinner or skeleton
- **Mobile first:** Write mobile styles first, use `md:` breakpoint only if needed
- **No hardcoded colours:** Always use CSS tokens — `var(--color-primary)` not `#7FAF72`
- **No hardcoded strings:** All UI copy goes through constants or props — never inline in JSX

---

## 11. Build Order

Build in this exact order. Don't skip ahead.

1. ✅ `tokens.css` — design tokens
2. ✅ `types/` — all TypeScript interfaces
3. ✅ `utils/` — calculator, formatters, investment data
4. ✅ UI primitives — `Button`, `Card`, `Badge`, `Input`
5. ✅ Layout — `BottomNav`, `Header`, `PageWrapper`
6. ✅ `Onboarding.tsx` — localStorage profile setup
7. ✅ `Home.tsx` — dashboard with live projection
8. ✅ `GrowMoney.tsx` — investment cards
9. ✅ `Calculator.tsx` — SIP calculator with chart
10. ✅ `Basics.tsx` — concept cards
11. ✅ FastAPI backend — `main.py`, `calculator` route, `chat` route
12. ✅ `AskAnything.tsx` — chat wired to backend
13. ✅ `MyPlan.tsx` — AI plan wired to backend
14. ✅ Connect everything — routing, nav, profile context
15. ✅ Polish — error states, loading states, mobile testing
16. ✅ Deploy — Vercel frontend + backend

---

## 12. What NOT to Build

- ❌ No user authentication or login in v1
- ❌ No database — localStorage only in v1
- ❌ No real brokerage integration
- ❌ No live market data in v1
- ❌ No portfolio tracker in v1
- ❌ No dark mode
- ❌ No gamification (badges, streaks, points)
- ❌ No social features
- ❌ No trading or order placement
- ❌ No PDF exports
- ❌ No push notifications

---

## 13. Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

### Backend (`.env`)
```
ANTHROPIC_API_KEY=your_key_here
ENVIRONMENT=development
```

### backend/.env.example
```
ANTHROPIC_API_KEY=
ENVIRONMENT=development
```

---

## 14. Git Conventions

- Branch: `main` — production only
- Feature branches: `feat/screen-name` (e.g. `feat/onboarding`, `feat/grow-money`)
- Commit format: `feat: add onboarding screen with localStorage profile`
- Types: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`

---

## 15. Disclaimer (include on all projection screens)

> Projections are illustrative, based on historical averages.
> Not SEBI-registered investment advice. Past returns do not guarantee future results.
EOF