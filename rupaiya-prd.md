# Rupaiya — Product Requirements Document
**Version:** 2.0  
**Author:** RK (S Sambhavi)  
**Status:** Active  
**Last Updated:** 2026-09-16

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

---

## 5. Non-Goals (v1)

- Actual trading or order placement
- Brokerage integration (Zerodha, Groww, etc.)
- Portfolio sync or tracking of existing investments
- Social features, community, leaderboards
- Recommendations with SEBI-registered advisory liability
- Cryptocurrency deep-dives
- Tax filing or CA-level advice

---

## 6. Screens — All 7

### Screen 1 — Onboarding
> First launch only. 3 questions. Sets up personal numbers everywhere.

- Age input
- Monthly income input
- Monthly investment capacity input
- Stored locally (no login required in v1)
- Never shown again after first completion

### Screen 2 — Home / Dashboard
> The hub. Your snapshot the moment you open the app.

- Big projection number (personalised)
- Age badge + monthly investment badge
- Quick nav cards to all 5 other screens
- No scrolling — everything visible at once

### Screen 3 — Grow Money
> All ways to invest in India. Risk graded. Your projections per option.

- 6 investment cards: Savings Account, FD, Mutual Funds SIP, Direct Stocks, Gold, Crypto
- Each card: risk grade (colour coded), return range, YOUR projected amount
- Tap to expand: plain-language explanation, year-by-year projection, meta tags
- "Ask about this" button → opens Ask Anything pre-filled

### Screen 4 — Calculator
> Play with numbers freely. Live updates.

- Monthly investment slider + input
- Years slider (1–30)
- Expected return rate selector (preset options + custom)
- Output: total value, total invested, total earned, multiplier
- Year-by-year growth chart
- All numbers tied to user's profile as defaults

### Screen 5 — Basics
> 5 core concepts. Explained like a friend. Real Indian examples.

- Compounding
- Inflation
- Risk vs Return
- SIP
- Diversification
- Each concept: plain explanation + real example using user's numbers
- No lessons, no modules, no quizzes

### Screen 6 — Ask Anything
> AI chat. Knows your profile. Speaks plainly.

- Pre-loaded starter questions
- Full conversation in session
- AI knows: age 35, ₹2L income, ₹10k/month, Indian context
- Responses under 200 words unless asked for more
- "Ask about this" from Grow Money lands here pre-filled

### Screen 7 — My Plan
> Personalised step-by-step plan. Built for you, not generic.

- AI generates a plan based on user profile
- "Here's exactly what to do first, second, third with your ₹10k/month"
- Step-by-step action items with amounts, instruments, why
- Regenerate button if user wants a different approach
- Links to relevant Grow Money cards and Basics concepts

---

## 7. Design System

### Palette

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

### Risk Scale Colours

| Risk Level | Background | Text | Usage |
|-----------|-----------|------|-------|
| Zero risk | `#E8F5E0` | `#3A6A28` | Savings account, liquid funds |
| Low | `#F5EED8` | `#7C5A00` | FD, RD, PPF |
| Medium | `#F5E5D0` | `#8C4010` | Mutual funds, gold |
| High | `#F5D8D8` | `#8C2010` | Direct stocks, sector funds |
| Very High | `#F0D0D0` | `#7C1010` | Small caps, crypto, F&O |

### Typography
- Font: `DM Sans` (Google Fonts)
- Weights: 400 (regular), 500 (medium), 700 (bold — numbers only)
- Hero numbers: 38–42px, weight 700, letter-spacing -1.5px
- Body: 14px, weight 400, line-height 1.6
- Labels/meta: 11–12px, weight 400–500
- No ALL CAPS, no decorative treatments

### Layout
- Mobile-first: max-width 480px centered
- Bottom navigation bar (5 items: Home, Grow, Calculate, Basics, Ask)
- Consistent padding: 20px horizontal, 16px vertical
- Card border-radius: 14px
- Button border-radius: 10px
- Pill border-radius: 20px

### Tone
- Warm, approachable, trusted friend
- Makes you feel: Growth
- NOT: aggressive, flashy, red/green trading app chaos
- Plain language always. Jargon explained immediately inline.

---

## 8. Technical Architecture

```
rupaiya/
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Primitives: Button, Card, Badge, Input
│   │   │   ├── layout/        # BottomNav, Header, PageWrapper
│   │   │   └── features/      # Feature-specific: InvestmentCard, ChatBubble
│   │   ├── pages/             # 7 route-level pages
│   │   │   ├── Onboarding.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── GrowMoney.tsx
│   │   │   ├── Calculator.tsx
│   │   │   ├── Basics.tsx
│   │   │   ├── AskAnything.tsx
│   │   │   └── MyPlan.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useProfile.ts  # User profile from localStorage
│   │   │   ├── useCalculator.ts
│   │   │   └── useChat.ts
│   │   ├── store/             # Zustand global state
│   │   │   ├── profileStore.ts
│   │   │   └── chatStore.ts
│   │   ├── types/             # TypeScript interfaces
│   │   │   ├── profile.ts
│   │   │   ├── investment.ts
│   │   │   └── chat.ts
│   │   ├── utils/             # Pure functions
│   │   │   ├── calculator.ts  # SIP, compound math
│   │   │   ├── formatters.ts  # ₹ formatting, Cr/L conversion
│   │   │   └── investments.ts # Investment data constants
│   │   ├── api/               # API client
│   │   │   └── client.ts      # Axios instance + endpoints
│   │   ├── styles/
│   │   │   └── tokens.css     # Design tokens as CSS vars
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                   # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   ├── plan.py
│   │   │   └── calculator.py
│   │   ├── services/
│   │   │   ├── claude.py      # Anthropic SDK, system prompts
│   │   │   └── calculator.py  # SIP/compound math
│   │   ├── models/
│   │   │   ├── profile.py     # UserProfile Pydantic model
│   │   │   ├── chat.py        # ChatRequest / ChatResponse
│   │   │   └── calculator.py  # CalculatorRequest / Response
│   │   └── config.py
│   ├── requirements.txt
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── README.md
└── .gitignore
```

### Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + TypeScript | Type safety, component reuse |
| Styling | Tailwind CSS + CSS tokens | Utility-first, design tokens |
| State | Zustand | Lightweight, no boilerplate |
| Routing | React Router v6 | Standard, simple |
| HTTP Client | Axios | Interceptors, error handling |
| Build | Vite | Fast HMR, modern bundler |
| Backend | Python FastAPI | Async, type-safe, Pydantic |
| AI | Anthropic Claude SDK (Python) | claude-sonnet-4-6 |
| Deployment | Vercel (frontend + backend) | Free tier, zero-config |
| Version Control | GitHub | Standard |

---

## 9. API Design

### Chat
```
POST /api/chat
Body: {
  message: string,
  history: [{role: "user"|"assistant", content: string}],
  userProfile: {
    age: number,
    monthlyIncome: number,
    monthlyInvestment: number,
    riskAppetite: "low" | "medium" | "high"
  }
}
Response: { reply: string }
```

### My Plan
```
POST /api/plan
Body: { userProfile: UserProfile }
Response: {
  steps: [{
    order: number,
    title: string,
    action: string,
    amount: number,
    instrument: string,
    why: string
  }]
}
```

### Calculator
```
POST /api/calculate/sip
Body: { monthly: number, ratePercent: number, years: number }
Response: {
  totalValue: number,
  totalInvested: number,
  totalGain: number,
  multiplier: number,
  yearlyBreakdown: [{year, value, invested}]
}
```

---

## 10. User Profile Schema

```typescript
interface UserProfile {
  age: number;                          // 35
  monthlyIncome: number;                // 200000
  monthlyInvestment: number;            // 10000
  riskAppetite: 'safe' | 'low' | 'medium' | 'high';
  onboardingComplete: boolean;
}
```

Stored in `localStorage` in v1. No login, no backend storage.

---

## 11. AI System Prompt

```
You are a friendly, plain-spoken personal finance guide for Indian markets.

User profile: {age} years old, earns ₹{monthlyIncome}/month, 
investing ₹{monthlyInvestment}/month, starting from zero savings.

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

## 12. Risk Grading Framework

| Grade | Label | Return Range | Examples |
|-------|-------|-------------|----------|
| 1 | Zero Risk | 3–4% | Savings account, liquid funds |
| 2 | Very Low | 6–7.5% | FD, RD, PPF, NSC |
| 3 | Low–Medium | 8–10% | Debt mutual funds, Gold, SGBs |
| 4 | Medium | 10–14% | Equity mutual funds, index funds |
| 5 | High | 15–30%+ | Direct stocks, sector funds |
| 6 | Very High | -80% to +500% | Small caps, F&O, Crypto |

---

## 13. Open Questions

- [ ] PWA support for mobile app-like install experience?
- [ ] Streaming AI responses or full response at once?
- [ ] Which NSE/BSE data API for Phase 2 — free tier limitations?
- [ ] Should My Plan be regeneratable or fixed once generated?

---

## 14. Milestones

| Milestone | Scope | Target |
|-----------|-------|--------|
| M1 — PRD + Repo | This PRD, GitHub repo, project scaffold | Week 1 |
| M2 — Design tokens + components | CSS tokens, Button, Card, Badge, BottomNav | Week 1 |
| M3 — Onboarding + Home | Screens 1 & 2, localStorage profile | Week 2 |
| M4 — Grow Money + Calculator | Screens 3 & 4, SIP math | Week 2 |
| M5 — Basics | Screen 5, concept cards | Week 3 |
| M6 — Backend + AI Chat | FastAPI, Claude SDK, Ask Anything | Week 3 |
| M7 — My Plan | AI-generated personalised plan | Week 4 |
| M8 — Polish + Deploy | Mobile responsiveness, error states, Vercel | Week 4–5 |
