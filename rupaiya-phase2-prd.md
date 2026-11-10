# Rupaiya Phase 2 — Portfolio Intelligence PRD
**Version:** 1.0  
**Author:** Aparna  
**Status:** Draft  
**Last Updated:** 2026-09-21  
**Depends on:** [rupaiya-prd.md](./rupaiya-prd.md) (Phase 1 / v1 — shipped)

---

## 1. Problem Statement

Phase 1 teaches RK *how money works* and gives illustrative projections by **asset type**. Once someone starts investing, a new question appears — one Phase 1 deliberately does not answer:

> "I have (or will have) a portfolio. **What's actually performing?** What should I **buy, hold, or sell** — and **why**?"

Today, Indians answer this by:
- Checking 5 different apps (broker, MF platform, bank FD passbook)
- Comparing last-year returns without risk context
- Following tips, influencers, or bank RM pitches with commission bias
- Doing nothing because comparison feels too complex

**Phase 2** adds a **portfolio intelligence layer** on top of Rupaiya's education foundation:
- Track holdings (manual or imported)
- Measure performance vs benchmarks and peers
- Recommend allocation and rebalancing
- Rank instruments within category using data + models
- Explain every signal in plain language via agents

**Not a trading app.** Users decide and execute elsewhere. Rupaiya shows *what the data suggests* with honest uncertainty and disclaimers.

---

## 2. Relationship to Phase 1

| Phase 1 (v1) | Phase 2 |
|--------------|---------|
| Profile in localStorage | Profile + **portfolio** (server-backed, optional account) |
| Static return *ranges* by instrument type | **Live/historical** NAV & index data |
| Illustrative SIP projections | **Actual XIRR** + benchmark comparison |
| Goal-fit plan (AI narrative) | **Quantified** allocation + drift + signals |
| "Ask Anything" (education) | **Portfolio agent** (tools + explanations) |
| No buy/sell language | **Buy / Hold / Sell** with guardrails |

Phase 1 remains the onboarding funnel. Phase 2 unlocks after user opts in ("Track my portfolio") or completes onboarding + first manual holding.

---

## 3. Target User (Phase 2)

**Primary (same persona, next life stage):** RK — now has started SIP + FD, wants to know if he's on track and what to adjust.

**Phase 2 eligibility profile:**
- Has at least one investment OR commits to logging holdings within 7 days
- Completed Phase 1 onboarding (age, income, risk, goals)
- Comfortable uploading CAS statement OR entering 1–5 holdings manually

**Secondary:** Power user — imports full CAS, wants category ranker and rebalance alerts.

**Out of scope user:** Day trader, F&O speculator, crypto-only portfolio (v2.1+).

---

## 4. Vision (Phase 2)

> "The clearest, most honest view of *your* money — how it's doing, how it compares, and what to consider changing — explained like a friend who actually ran the numbers."

---

## 5. Core User Goals

| Goal | Success metric |
|------|----------------|
| See portfolio performance | User views XIRR vs Nifty SIP benchmark within 30s of opening Portfolio |
| Compare holdings fairly | Each holding shows return vs **category** benchmark, not random cross-asset comparison |
| Know what to do next | User receives ≤5 prioritized actions (buy/hold/sell/allocate) with plain-language why |
| Trust the system | Every signal cites data source + date; disclaimers visible; no guaranteed return language |
| Import without pain | CAS upload → parsed holdings in <2 min (happy path) |
| Ask portfolio questions | "Why sell X?" → agent answer grounded in user's holdings + model output |

---

## 6. Non-Goals (Phase 2 v1)

- Order placement or brokerage integration
- Auto-trading or linked bank debits
- SEBI-registered personalized investment advice (unless legal registers later)
- Stock-picking on individual equities (MF/ETF/index focus first)
- Real-time intraday prices
- Tax filing or ITR generation
- Multi-currency / US stocks
- Social portfolio sharing or leaderboards
- Crypto portfolio tracking (Phase 2.1 candidate)

---

## 7. Product Principles

1. **Compare within category** — large-cap MF vs large-cap MF, never MF vs FD on return alone.
2. **Risk before return** — show drawdown and volatility alongside CAGR.
3. **Rebalance > predict** — default signals come from allocation drift, not price forecasting.
4. **Explain every signal** — no black-box "AI says sell."
5. **Point-in-time honesty** — backtests and ranks use data available *at decision time* (no lookahead).
6. **Phase 1 tone preserved** — plain language, Indian context, no sycophancy, honest downsides.

---

## 8. Screens & Features

### Screen P1 — Portfolio Overview (`/portfolio`)
> Hub for Phase 2. Replaces nothing in Phase 1; new top-nav item.

**Shows:**
- Total portfolio value (as of last NAV date)
- Overall XIRR (money-weighted) vs benchmark SIP XIRR
- Allocation donut: equity / debt / gold / cash / other
- Drift vs target allocation (from optimizer)
- Top 3 actions (buy/hold/sell chips) with severity

**Empty state:** "Add your first holding" → manual entry or CAS upload.

---

### Screen P2 — Holdings List (`/portfolio/holdings`)

**Per holding row:**
- Name, ISIN/scheme code, asset class, category
- Current value, weight %, invested amount
- XIRR or simple return (if cost basis known)
- vs category median (3Y rolling)
- Signal badge: Buy | Hold | Sell | Trim
- Sparkline: 1Y NAV or index

**Actions:** Add holding, edit, mark closed, refresh NAV.

---

### Screen P3 — Holding Detail (`/portfolio/holdings/:id`)

**Sections:**
- Performance: 1Y / 3Y / 5Y vs benchmark
- Risk: volatility, max drawdown (category context)
- Fund facts: TER, AUM, category, fund house (MF/ETF)
- **Why this signal?** — rule + model factors (expandable)
- Related Learning concepts (link to Phase 1 `/learning`)
- "Ask about this holding" → Portfolio agent

---

### Screen P4 — Signals & Rebalance (`/portfolio/signals`)

**Prioritized action list:**

| Action | Example |
|--------|---------|
| Buy | "Add ₹3,000/mo to UTI Nifty Index — you're 12% underweight equity" |
| Trim | "Reduce Parag Parikh Flexi Cap by ₹50k — overweight vs target" |
| Hold | "Continue HDFC Liquid — emergency bucket, no change" |
| Switch | "Consider switching from Active Large Cap X to Index Y — lagged category 3Y" |

Each row: confidence (low/med/high), data as-of date, disclaimer link.

**No one-tap execute** — copy suggestion or open broker manually.

---

### Screen P5 — Compare (`/portfolio/compare`)

**Modes:**
- **My holdings** — side-by-side table, same category only (filter enforced)
- **Category explorer** — top quartile funds in "Large Cap" with rank score breakdown
- **What-if** — "If I move ₹5k from FD to index SIP, projected impact" (extends Phase 1 calculator)

---

### Screen P6 — Import (`/portfolio/import`)

**Paths:**
1. **Manual** — ISIN or scheme name search (AMFI master), units, avg cost, date
2. **CAS upload** — PDF/CSV from NSDL/CDSL (parser v1: common formats)
3. **SIP-only mode** — no holdings yet; log planned SIPs for forward tracking

---

### Screen P7 — Portfolio Agent (`/portfolio/ask` or tab on P1)

Extends Ask Anything with **portfolio tools**:
- "How am I doing vs Nifty?"
- "Why should I trim fund X?"
- "What if I increase SIP by ₹5,000?"

Uses Claude + tool calls (not free-form guessing).

---

## 9. Decision System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  DATA INGESTION (batch, daily)                              │
│  AMFI NAV · NSE indices · fund metadata · rate tables       │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FEATURE STORE (monthly snapshots, point-in-time)           │
│  rolling CAGR · vol · drawdown · TER · vs benchmark         │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ Performance  │  │ Allocation   │  │ Category Ranker (ML) │
│ & XIRR       │  │ Optimizer    │  │ LightGBM / rules     │
└──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘
       │                 │                      │
       └─────────────────┼──────────────────────┘
                         ▼
              ┌─────────────────────┐
              │ Signal Engine       │
              │ Buy / Hold / Sell   │
              │ (rules + ML score)  │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ Portfolio Agent     │
              │ (Claude + tools)      │
              │ + compliance guard    │
              └─────────────────────┘
```

---

## 10. Models — Specification

### 10.1 Performance & Attribution (rules, no ML)

**Inputs:** holdings, transactions, NAV history, benchmark index  
**Outputs:**
- Portfolio XIRR (Newton-Raphson on cashflows)
- Per-holding contribution to total return
- Benchmark-equivalent SIP XIRR for same cashflow dates
- Rolling windows: 1Y, 3Y, 5Y (where data exists)

**Acceptance:** XIRR matches Excel XIRR within 0.01% on test portfolios.

---

### 10.2 Allocation Optimizer (rules → optional optimization)

**Inputs:** `UserProfile` + Phase 2 extensions (`primaryGoal`, `horizonYears`, `taxSlab`, `emergencyMonths`)  
**Outputs:** target weights by asset class

**v1 method:** lookup table by risk + horizon (same philosophy as Phase 1 My Plan).

**v1.1 method:** mean-variance with constraints (min cash, max single-fund weight 25%).

**Acceptance:** safe profile never outputs >40% equity; high risk never <50% equity for 15Y+ horizon.

---

### 10.3 Category Ranker (ML v1)

**Task:** Rank funds/ETFs **within AMFI category** (not cross-category).

**Features (point-in-time monthly):**
| Feature | Description |
|---------|-------------|
| `cagr_3y`, `cagr_5y` | Rolling CAGR |
| `vol_3y` | Annualized std dev of monthly returns |
| `max_drawdown_3y` | Peak-to-trough |
| `expense_ratio` | TER |
| `aum_log` | Log AUM |
| `info_ratio_3y` | vs category benchmark |
| `downside_capture` | In Nifty -10% months |

**Label (training):**
- `excess_3y_forward` = fund 3Y forward return − category median forward return  
- Or binary: `top_quartile_next_3y`

**Model:** LightGBM ranker (LambdaRank) or gradient boosting regressor.  
**Baseline to beat:** 5Y CAGR − TER − 0.5 × max_drawdown (rule score).

**Evaluation:**
- Information coefficient (rank vs forward return)
- Top-decile spread (backtest)
- Walk-forward: train ≤2020, validate 2021–2023, test 2024+

**Acceptance:** ML beats baseline IC by ≥0.02 on validation; document when it doesn't.

---

### 10.4 Buy / Hold / Sell Signal Engine (hybrid)

**Priority order:**
1. **Goal / horizon change** → rebalance allocation (may trigger multiple buys/sells)
2. **Weight drift** → trim if `current_weight > target + band` (default band 5pp)
3. **Ranker score** → switch signal if held >180 days AND score in bottom quartile of category
4. **Tax-aware trim** (v1.1) → harvest losses if LTCG slot available
5. **Default** → Hold

**Output schema:**
```json
{
  "holdingId": "uuid",
  "action": "buy" | "hold" | "sell" | "trim" | "switch",
  "severity": "low" | "medium" | "high",
  "suggestedAmountInr": 5000,
  "reasonCodes": ["OVERWEIGHT_EQUITY", "BOTTOM_QUARTILE_3Y"],
  "explanationTemplateId": "trim_overweight",
  "modelVersion": "ranker_v1.2",
  "dataAsOf": "2026-09-20"
}
```

**Acceptance:** No sell signal on emergency-fund liquid holdings unless user marks goal complete.

---

### 10.5 Portfolio Agent (Claude + tools)

**Tools (FastAPI):**
| Tool | Purpose |
|------|---------|
| `get_portfolio_summary` | Value, XIRR, allocation |
| `get_holding_detail` | Single holding performance |
| `get_signals` | Current buy/hold/sell list |
| `get_category_ranks` | Top funds in category |
| `run_what_if` | Allocation change simulation |
| `get_benchmark_comparison` | vs Nifty TRI SIP |

**System prompt additions:**
- Must cite `dataAsOf` and model version when discussing performance
- Must not guarantee future returns
- Must explain sell signals with reason codes
- Must refuse single-stock tips in Phase 2 v1

**Guardrail layer (pre/post filter):**
- Block phrases: "guaranteed", "sure shot", "can't lose"
- Require disclaimer on first portfolio message per session

---

## 11. Data Requirements

### 11.1 External data sources

| Data | Source | Refresh | License notes |
|------|--------|---------|---------------|
| MF daily NAV | AMFI bulk download | Daily 11 PM IST | Public; attribute AMFI |
| Scheme master (ISIN, category) | AMFI | Weekly | Public |
| Index levels (Nifty 50 TRI, etc.) | NSE / third party | Daily | Check NSE terms |
| G-Sec / FD reference rates | RBI | Monthly | Public |
| ETF prices | NSE | Daily | Check terms |

**Vendor alternatives (if build vs buy):** Tickertape API, Morningstar Direct, Value Research Online.

### 11.2 Internal data (new Supabase tables)

```sql
-- Users (Phase 2 introduces optional auth)
users (id, email, created_at, ...)  -- or continue anonymous device id

portfolios (id, user_id, name, base_currency, created_at)

holdings (
  id, portfolio_id, isin, scheme_code, name, asset_class, category,
  units, avg_cost, first_invested_at, status, source
)

transactions (
  id, holding_id, type, units, amount_inr, date, notes
)

nav_prices (
  scheme_code, date, nav, source
)

index_prices (
  index_id, date, level, source
)

fund_features (
  scheme_code, as_of_month, feature_json, model_version
)

fund_ranks (
  scheme_code, category, as_of_date, score, quartile, model_version
)

portfolio_signals (
  id, portfolio_id, holding_id, action, severity, payload_json,
  generated_at, model_version, dismissed_at
)

cas_imports (
  id, user_id, file_hash, status, parsed_json, created_at
)
```

### 11.3 Feature store

- **Batch job** (Python): nightly NAV ingest → monthly feature snapshot  
- **Storage:** parquet on object storage or TimescaleDB hypertable  
- **Point-in-time joins:** no future NAV in historical training rows  

---

## 12. API Contracts (Phase 2 additions)

Prefix: `/api/portfolio` (authenticated or device-token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/summary` | Overview metrics |
| GET | `/holdings` | List holdings |
| POST | `/holdings` | Add manual holding |
| PUT | `/holdings/{id}` | Update |
| DELETE | `/holdings/{id}` | Remove |
| POST | `/import/cas` | Upload CAS file |
| GET | `/signals` | Current signals |
| POST | `/signals/{id}/dismiss` | User dismissed suggestion |
| GET | `/compare?category=` | Category rank table |
| POST | `/chat` | Portfolio agent (extends `/api/chat` with tools) |
| GET | `/benchmarks` | Available benchmarks + latest levels |

**Example — GET `/api/portfolio/summary`**
```json
{
  "totalValueInr": 485000,
  "investedInr": 420000,
  "xirr": 11.2,
  "benchmarkXirr": 10.8,
  "benchmarkId": "NIFTY50-TRI-SIP",
  "allocation": { "equity": 0.55, "debt": 0.30, "gold": 0.05, "cash": 0.10 },
  "targetAllocation": { "equity": 0.50, "debt": 0.35, "gold": 0.05, "cash": 0.10 },
  "dataAsOf": "2026-09-20",
  "signalCount": 3
}
```

---

## 13. Auth & Privacy (Phase 2)

Phase 1 used localStorage only. Phase 2 **requires server-side portfolio storage**.

**v1 auth options (pick one at implementation):**
- **A)** Supabase Auth (email magic link) — recommended  
- **B)** Anonymous device ID + optional email link later  
- **C)** Continue local-only portfolio in IndexedDB — limits ML freshness, not recommended  

**Privacy:**
- Holdings encrypted at rest (Supabase RLS per user)
- CAS files deleted after parse (store only structured holdings)
- No selling of portfolio data
- Export & delete account (DPDP alignment)

---

## 14. Legal & Compliance

| Topic | Phase 2 stance |
|-------|----------------|
| SEBI RIA | Product is **decision support**, not registered advice in v1; legal review before marketing "recommendations" |
| Disclaimers | Every signal screen: past performance, not guaranteed, user executes independently |
| Model transparency | Show reason codes + data date; no "AI magic" |
| CAS parsing | User attests they own the statement; secure upload |
| Marketing | Avoid "beat the market" / "best fund" superlatives |

**Required disclaimer (all Phase 2 portfolio screens):**
> Signals are illustrative, based on historical data and model scores. Not SEBI-registered investment advice. Past returns do not guarantee future results. You execute all trades independently.

---

## 15. Tech Stack (additions to Phase 1)

| Layer | Technology |
|-------|------------|
| Batch ETL | Python (polars/pandas), scheduled via GitHub Actions or cron |
| Feature / ML training | Python, LightGBM, scikit-learn, MLflow |
| Model serving | Precomputed ranks in Supabase; on-demand XIRR in FastAPI |
| Time series storage | TimescaleDB extension or S3 parquet |
| CAS parsing | pdfplumber / custom regex v1; dedicated parser service v2 |
| Agent | Claude Sonnet + tool use (extend `backend/app/services/claude.py`) |
| Frontend | New pages under `frontend/src/pages/portfolio/` |

---

## 16. Folder Structure (new)

```
backend/
  app/
    routes/portfolio.py
    routes/portfolio_chat.py
    services/
      portfolio.py          # XIRR, attribution
      allocation.py         # target weights
      signals.py            # buy/hold/sell engine
      amfi_ingest.py
      ranker.py             # inference
    models/portfolio.py
  ml/
    train_ranker.py
    backtest.py
    features.py
jobs/
  nightly_nav_ingest.py
  monthly_feature_build.py

frontend/src/
  pages/portfolio/
    Overview.tsx
    Holdings.tsx
    HoldingDetail.tsx
    Signals.tsx
    Compare.tsx
    Import.tsx
    PortfolioAsk.tsx
  hooks/usePortfolio.ts
  types/portfolio.ts

supabase/migrations/
  003_portfolio_schema.sql
```

---

## 17. Milestones

| Milestone | Scope | Target |
|-----------|-------|--------|
| **M2.1 — Schema & manual holdings** | Tables, CRUD, manual entry UI, basic portfolio value | Week 1–2 |
| **M2.2 — NAV ingest** | AMFI daily job, scheme search, holding valuation | Week 3–4 |
| **M2.3 — Performance** | XIRR, benchmark SIP, holdings list UI | Week 5–6 |
| **M2.4 — Allocation & drift** | Target weights, donut, drift badges | Week 7 |
| **M2.5 — Signal engine v0** | Rule-based buy/hold/sell (no ML) | Week 8 |
| **M2.6 — Category ranker v0** | Rule baseline score, compare screen | Week 9–10 |
| **M2.7 — ML ranker v1** | Train, backtest, deploy ranks to DB | Week 11–13 |
| **M2.8 — CAS import v1** | PDF parse happy path | Week 14–15 |
| **M2.9 — Portfolio agent** | Tools + Claude + guardrails | Week 16–17 |
| **M2.10 — Auth & privacy** | Supabase Auth, RLS, export/delete | Week 18 |
| **M2.11 — Beta & legal review** | Disclaimers, paper trading mode, friend testing | Week 19–20 |

---

## 18. Success Metrics

| Metric | Target (90 days post-beta) |
|--------|---------------------------|
| Portfolio activation | 30% of MAU add ≥1 holding |
| Weekly return visits | 40% of portfolio users |
| Signal engagement | 50% open Signals screen within 7 days of generation |
| Agent usage | 20% ask ≥1 portfolio question/month |
| Trust | <5% signals dismissed as "not relevant" (in-app feedback) |
| Model quality | Ranker IC > baseline on rolling 12-month eval |

---

## 19. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Bad buy/sell advice damages trust | Rules-first; ML ranks only within category; heavy disclaimers |
| AMFI data gaps / delays | Stale-data badge; fallback to last known NAV |
| CAS parse failures | Manual edit flow; clear error messages |
| SEBI regulatory exposure | Legal review; decision-support positioning; no auto-execution |
| Overfitting in ML | Walk-forward validation; simple baseline; publish model limits |
| User expects live trading | Copy: "Rupaiya doesn't move money" |

---

## 20. Open Questions

- [ ] Supabase Auth vs anonymous portfolio for beta?
- [ ] NSE index data — direct license vs vendor?
- [ ] Include ETFs only first, or active MFs from day one?
- [ ] Tax-aware signals in v1 or v1.1?
- [ ] Push notifications for rebalance alerts?
- [ ] Paper portfolio mode for users with zero holdings?
- [ ] Register as SEBI IA/RIA in future — yes/no and timeline?

---

## 21. Appendix — Signal Reason Codes

| Code | Meaning |
|------|---------|
| `OVERWEIGHT_ASSET_CLASS` | Class weight above target + band |
| `UNDERWEIGHT_ASSET_CLASS` | Class weight below target − band |
| `BOTTOM_QUARTILE_3Y` | Ranker score in bottom 25% of category |
| `TOP_QUARTILE_3Y` | Candidate for new buy or switch target |
| `LAGS_BENCHMARK` | Holding 3Y return < benchmark − threshold |
| `EMERGENCY_HOLD` | Liquid bucket — no action |
| `GOAL_HORIZON_SHORT` | Equity trim suggested — goal < 3Y away |
| `MIN_HOLD_PERIOD` | Suppress sell — held < 180 days |
| `USER_DISMISSED` | User hid this signal |

---

## 22. Appendix — Phase 1 → Phase 2 Profile Extensions

```typescript
interface Phase2ProfileExtensions {
  taxSlab?: '0' | '5' | '10' | '20' | '30';
  horizonYears?: number;
  emergencyMonthsCovered?: number;
  portfolioActivated?: boolean;
  rebalanceBandPct?: number;  // default 5
  preferredBenchmarkId?: string;  // default NIFTY50-TRI-SIP
}
```

---

*Phase 2 builds on Rupaiya's education foundation. The goal is not to predict the market — it is to help RK see clearly, compare fairly, and act thoughtfully.*
