#!/usr/bin/env python3
"""Generate supabase/seed/concepts.json from the Rupaiya knowledge base blueprint."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from layman import layman

OUTPUT = Path(__file__).parent / "concepts.json"
COPY_PATH = Path(__file__).parent / "concept_copy.json"


def _load_concept_copy() -> dict[str, list[str]]:
    if not COPY_PATH.exists():
        return {}
    data = json.loads(COPY_PATH.read_text(encoding="utf-8"))
    return {k: v for k, v in data.items() if isinstance(v, list) and v}


EXAMPLE_KEY_OVERRIDES: dict[str, str] = {
    "compounding": "compounding",
    "inflation": "inflation",
    "risk-vs-return": "riskReturn",
    "diversification": "diversification",
    "sip": "sip",
}

# (id, title, tagline, explanation, keywords, relatedInvestmentIds)
ConceptSeed = tuple[str, str, str, str, list[str], list[str]]

GROUPS: list[tuple[str, list[ConceptSeed]]] = [
    (
        "money-fundamentals",
        [
            (
                "what-is-money",
                "What is money",
                "Why a rupee has value",
                "Money is a shared agreement — a ₹100 note has value because everyone accepts it for goods and services. "
                "In India, the RBI backs this trust, but inflation slowly erodes what each rupee can buy over time.",
                ["money", "rupee", "RBI", "value", "currency"],
                ["savings"],
            ),
            (
                "compounding",
                "Compounding",
                "How money multiplies itself",
                "Compounding means your money earns returns, and then those returns also earn returns. "
                "Over years, this snowball effect is what turns a ₹10,000 monthly SIP into crores — the earlier you start, the harder compounding works for you.",
                ["compound interest", "growth", "returns", "snowball"],
                ["mutual-funds"],
            ),
            (
                "inflation",
                "Inflation",
                "Why doing nothing is losing",
                "Inflation is the steady rise in prices — ₹100 today buys less than ₹100 did a decade ago. "
                "If your savings earn 3.5% but inflation runs at 6%, you are quietly losing purchasing power every year.",
                ["purchasing power", "prices", "CPI", "real returns"],
                ["savings", "fd"],
            ),
            (
                "time-value-of-money",
                "Time value of money",
                "₹1 lakh today vs ₹1 lakh in 10 years",
                "₹1 lakh in your hand today is worth more than ₹1 lakh promised 10 years from now, because you can invest it now and let it grow. "
                "This is why delaying investments — even by a few years — costs you far more than the amount you skipped.",
                ["present value", "future value", "discounting", "delay cost"],
                ["mutual-funds", "fd"],
            ),
            (
                "opportunity-cost",
                "Opportunity cost",
                "Every choice has a hidden price",
                "Every rupee you spend on one thing is a rupee you cannot invest elsewhere. "
                "That ₹40,000 phone upgrade could have been a year of SIP — the hidden cost is the future wealth you gave up.",
                ["trade-off", "choice", "alternative", "hidden cost"],
                [],
            ),
            (
                "net-worth",
                "Net worth",
                "The only number that actually matters",
                "Net worth is everything you own minus everything you owe — your assets minus your loans and credit card debt. "
                "A ₹20 lakh salary means little if you owe ₹15 lakh; track net worth, not just income.",
                ["assets", "liabilities", "wealth", "balance sheet"],
                [],
            ),
            (
                "cash-flow",
                "Cash flow",
                "Money coming in vs money going out",
                "Cash flow is the monthly rhythm of money in (salary, side income) and money out (rent, EMIs, Swiggy). "
                "You can earn well and still feel broke if outflows always match inflows — positive cash flow is what creates savings.",
                ["income", "expenses", "budget", "surplus"],
                ["savings"],
            ),
            (
                "rich-vs-wealthy",
                "Rich vs wealthy",
                "The difference between being rich and being wealthy",
                "Being rich is about high income and visible spending; being wealthy is about what you keep and grow over time. "
                "Many high earners in Mumbai live paycheque to paycheque, while quiet compounding builds real wealth.",
                ["income", "wealth", "assets", "lifestyle"],
                ["mutual-funds"],
            ),
        ],
    ),
    (
        "saving",
        [
            (
                "emergency-fund",
                "Emergency fund",
                "Your financial airbag",
                "An emergency fund is 3–6 months of expenses kept in a savings account or liquid fund — for job loss, medical bills, or family crises. "
                "Without it, one surprise forces you into credit card debt or selling investments at the wrong time.",
                ["rainy day", "buffer", "liquid", "safety net"],
                ["savings"],
            ),
            (
                "pay-yourself-first",
                "Pay yourself first",
                "Savings before expenses, not after",
                "Pay yourself first means moving money to savings or investments the day your salary hits, before rent and bills. "
                "What is left is what you spend — not the other way around.",
                ["auto-save", "salary", "discipline", "priority"],
                ["savings", "mutual-funds"],
            ),
            (
                "rule-50-30-20",
                "50-30-20 rule",
                "How to split your salary",
                "A simple starting framework: 50% for needs (rent, groceries), 30% for wants (dining, travel), 20% for savings and investments. "
                "In expensive cities like Bangalore, you may need to adjust — but the habit of earmarking 20% matters most.",
                ["budget split", "needs wants savings", "salary allocation"],
                ["savings"],
            ),
            (
                "good-debt-vs-bad-debt",
                "Good debt vs bad debt",
                "Home loan vs credit card",
                "Good debt helps you build assets — like a home loan at 8.5% when property may appreciate. "
                "Bad debt funds consumption at high rates — credit cards at 36–42% annual interest destroy wealth fast.",
                ["home loan", "credit card", "EMI", "interest rate"],
                [],
            ),
            (
                "credit-cards",
                "Credit cards",
                "How to use them without the trap",
                "A credit card is a 30–45 day interest-free loan — useful for rewards and credit history if you pay the full bill every month. "
                "Paying only the minimum due triggers 36–42% annual interest on the balance — one month of rollover can wipe out a year of SIP gains.",
                ["credit card", "minimum due", "rewards", "revolving credit", "CIBIL"],
                [],
            ),
            (
                "personal-loans",
                "Personal loans",
                "When they make sense",
                "Personal loans are unsecured bank loans at 10–18% for weddings, medical emergencies, or debt consolidation — no collateral but higher rates than home loans. "
                "Use for true emergencies or consolidating expensive credit card debt into a lower EMI — never for vacations, gadgets, or investing.",
                ["personal loan", "unsecured loan", "PL interest", "debt consolidation"],
                [],
            ),
            (
                "buy-now-pay-later",
                "Buy Now Pay Later (BNPL)",
                "The hidden EMI trap",
                "BNPL apps split purchases into 3–4 instalments interest-free — feels harmless but encourages overspending and missed payments hurt your credit score. "
                "Treat BNPL as a loan, not free money; if you would not buy it outright, do not BNPL it.",
                ["BNPL", "Split pay", "LazyPay", "Simpl", "overspending"],
                [],
            ),
            (
                "credit-score",
                "Credit score",
                "What it is, why it matters, how to build it",
                "Your CIBIL score (300–900) tells banks how reliably you repay loans — above 750 gets you better home loan rates. "
                "Pay EMIs on time, keep credit utilisation low, and avoid too many loan enquiries in a short period.",
                ["CIBIL", "credit history", "loan eligibility", "score"],
                [],
            ),
            (
                "saving-when-expensive",
                "Saving when everything is expensive",
                "How to actually save when everything is expensive",
                "When rent and groceries eat half your salary, start small — even ₹2,000/month builds the habit. "
                "Cut one recurring leak (unused subscriptions, daily cab rides) before trying to overhaul your entire lifestyle.",
                ["frugal", "cost of living", "small starts", "habits"],
                ["savings"],
            ),
            (
                "sinking-funds",
                "Sinking funds",
                "Saving for a specific future expense",
                "A sinking fund is money set aside for a known future expense — school fees, a wedding, or car insurance renewal. "
                "Unlike an emergency fund, you know when and roughly how much you need, so you can plan monthly contributions.",
                ["goal saving", "planned expense", "separate pot"],
                ["savings", "fd"],
            ),
            (
                "automating-savings",
                "Automating savings",
                "Set it and forget it",
                "Set up a standing instruction or SIP so money moves automatically on salary day — no willpower required. "
                "Most Indians who build wealth consistently use automation; what you never see in your spending account, you won't spend.",
                ["auto-debit", "standing instruction", "SIP", "automation"],
                ["savings", "mutual-funds"],
            ),
        ],
    ),
    (
        "investing-basics",
        [
            (
                "why-you-must-invest",
                "Why you must invest",
                "Saving alone is not enough",
                "A savings account at 3.5% cannot keep up with 6% inflation — your money shrinks in real terms. "
                "Investing puts your rupees to work in mutual funds, FDs, or stocks so they grow faster than prices rise.",
                ["inflation beat", "wealth building", "real returns"],
                ["savings", "mutual-funds", "fd"],
            ),
            (
                "risk-vs-return",
                "Risk vs return",
                "They always travel together",
                "Higher potential returns always come with higher risk — a savings account is safe but slow, stocks can soar or crash. "
                "There is no free lunch in finance; know your comfort level before choosing where to put your money.",
                ["risk", "volatility", "returns", "trade-off"],
                ["savings", "fd", "mutual-funds", "stocks"],
            ),
            (
                "diversification",
                "Diversification",
                "Don't bet everything on one thing",
                "Spreading money across equity, debt, and gold reduces the chance one bad bet wipes you out. "
                "Even within stocks, owning 15–20 companies or an index fund beats betting everything on one hot tip.",
                ["asset allocation", "portfolio", "spread risk"],
                ["mutual-funds", "fd", "gold"],
            ),
            (
                "asset-classes",
                "Asset classes",
                "Stocks, bonds, gold, real estate explained",
                "Asset classes are broad categories — equity (company ownership), debt (loans to companies or government), gold, and property. "
                "Each behaves differently in booms and crashes, which is why mixing them smooths your journey.",
                ["equity", "debt", "gold", "real estate", "mix"],
                ["mutual-funds", "stocks", "gold", "fd"],
            ),
            (
                "liquidity",
                "Liquidity",
                "How quickly can you get your money back",
                "Liquidity is how fast you can convert an investment to cash without a big loss — savings accounts are instant, FDs have lock-in, property can take months. "
                "Keep emergency money liquid; long-term goals can sit in less liquid options with higher returns.",
                ["lock-in", "redemption", "access", "cash"],
                ["savings", "fd", "mutual-funds"],
            ),
            (
                "rupee-cost-averaging",
                "Rupee cost averaging",
                "Why timing the market doesn't matter",
                "Rupee cost averaging means investing a fixed amount regularly — you buy more units when prices are low and fewer when high. "
                "Over time, your average cost smooths out, which is why SIPs work without trying to predict the Nifty.",
                ["SIP", "averaging", "market timing", "regular investing"],
                ["mutual-funds"],
            ),
            (
                "sip",
                "SIP",
                "The lazy person's wealth builder",
                "A Systematic Investment Plan (SIP) auto-invests a fixed amount every month into a mutual fund via your bank. "
                "You do not need to time the market — consistency over 10–15 years is what builds serious wealth in India.",
                ["systematic investment plan", "monthly", "mutual fund"],
                ["mutual-funds"],
            ),
            (
                "lump-sum-vs-sip",
                "Lump sum vs SIP",
                "Which is better when",
                "Lump sum works when you have a large amount and markets are depressed; SIP works when you invest from monthly salary. "
                "For most salaried Indians, SIP removes the stress of picking the perfect entry point.",
                ["one-time", "monthly", "entry timing", "salary"],
                ["mutual-funds"],
            ),
            (
                "cagr",
                "CAGR",
                "What that % number actually means",
                "CAGR (Compound Annual Growth Rate) is the smooth yearly return that takes an investment from start to end value — it accounts for compounding. "
                "If a fund doubled in 5 years, CAGR is about 14.9%, not simply 20% per year.",
                ["compound annual growth", "returns", "percentage"],
                ["mutual-funds", "stocks"],
            ),
            (
                "absolute-vs-cagr",
                "Absolute return vs CAGR",
                "Don't get confused",
                "Absolute return is the total gain — ₹1 lakh becoming ₹1.5 lakh is 50% absolute. "
                "CAGR annualises that over the holding period; always compare investments using CAGR for the same time frame.",
                ["total return", "annualised", "comparison"],
                ["mutual-funds"],
            ),
            (
                "power-of-starting-early",
                "Power of starting early",
                "The 10 year difference",
                "Starting a ₹10,000 SIP at 25 vs 35 can mean ₹2 crore vs ₹80 lakh at 55 — same amount, same fund, different start. "
                "The first 10 years of compounding do the heaviest lifting; waiting for the 'right time' is expensive.",
                ["early start", "time horizon", "compounding advantage"],
                ["mutual-funds"],
            ),
            (
                "setting-financial-goals",
                "Setting financial goals",
                "Specific, time-bound, in rupees",
                "A good goal is concrete: '₹25 lakh for home down payment in 5 years' beats 'save more money'. "
                "Put a rupee amount and deadline on every goal — then work backwards to the monthly SIP or FD needed.",
                ["SMART goals", "target amount", "timeline"],
                ["mutual-funds", "fd"],
            ),
        ],
    ),
    (
        "mutual-funds",
        [
            (
                "what-is-a-mutual-fund",
                "What is a mutual fund",
                "Pooled money explained",
                "A mutual fund pools money from thousands of investors and a fund manager invests it in stocks, bonds, or both. "
                "You own units of the fund, not individual shares — professional management and diversification for as little as ₹500/month.",
                ["AMC", "pool", "fund manager", "units", "NAV"],
                ["mutual-funds"],
            ),
            (
                "how-mutual-funds-make-money",
                "How mutual funds make money",
                "How a mutual fund actually makes you money",
                "You profit when the stocks or bonds in the fund rise in value, and sometimes from dividends or interest paid out. "
                "Your units grow in value (NAV rises) — you redeem when you need the money, minus any exit load or tax.",
                ["NAV growth", "dividends", "capital gains", "returns"],
                ["mutual-funds"],
            ),
            (
                "nav",
                "NAV",
                "What it is and what it isn't",
                "NAV (Net Asset Value) is the per-unit price of a mutual fund — total fund value divided by units outstanding. "
                "A lower NAV does not mean a 'cheaper' or better fund; what matters is future growth and the fund's track record.",
                ["net asset value", "unit price", "fund value"],
                ["mutual-funds"],
            ),
            (
                "expense-ratio",
                "Expense ratio",
                "The silent cost that compounds",
                "The expense ratio is the annual fee the fund charges — typically 0.5–2% for active funds, lower for index funds. "
                "A 1% difference over 20 years can cost lakhs; always check this on the fact sheet before investing.",
                ["TER", "fund fees", "cost", "AMC charges"],
                ["mutual-funds"],
            ),
            (
                "exit-load",
                "Exit load",
                "The penalty for leaving early",
                "Exit load is a fee charged if you redeem within a set period — often 1% if you exit equity funds within one year. "
                "It discourages short-term trading; plan to hold equity funds for at least 3–5 years to avoid this and benefit from compounding.",
                ["redemption fee", "early exit", "lock-in penalty"],
                ["mutual-funds"],
            ),
            (
                "direct-vs-regular-plan",
                "Direct vs regular plan",
                "Why direct saves you money",
                "Direct plans cut out the distributor commission — same fund, lower expense ratio, higher returns over time. "
                "Buy direct through the AMC website or apps like Groww and Coin; regular plans pay a hidden trail to agents.",
                ["direct plan", "regular plan", "commission", "zero commission"],
                ["mutual-funds"],
            ),
            (
                "equity-vs-debt-funds",
                "Equity vs debt funds",
                "Which for what goal",
                "Equity funds invest in stocks — higher return potential, more volatility, good for 5+ year goals. "
                "Debt funds invest in bonds — steadier, lower returns, better for 1–3 year goals or as a FD alternative.",
                ["equity fund", "debt fund", "hybrid", "goal matching"],
                ["mutual-funds"],
            ),
            (
                "index-funds",
                "Index funds",
                "Why boring wins long term",
                "Index funds passively track an index like Nifty 50 — no fund manager picking stocks, so fees stay very low. "
                "Most active funds fail to beat the index over 10 years; boring index investing is hard to argue with.",
                ["passive", "Nifty 50", "low cost", "tracking"],
                ["mutual-funds"],
            ),
            (
                "elss",
                "ELSS",
                "The fund that saves tax too",
                "ELSS (Equity Linked Savings Scheme) is a tax-saving mutual fund with a 3-year lock-in under Section 80C. "
                "You get up to ₹1.5 lakh deduction plus equity returns — but do not invest just for tax if you cannot lock money for 3 years.",
                ["tax saving fund", "80C", "lock-in 3 years"],
                ["mutual-funds"],
            ),
            (
                "large-cap-vs-mid-cap-vs-small-cap",
                "Large cap vs mid cap vs small cap",
                "What's the difference",
                "Large caps are big stable companies (Reliance, HDFC Bank) — steadier but slower. "
                "Mid and small caps are smaller companies with higher growth potential and sharper falls; match your risk appetite before choosing.",
                ["market cap", "large cap", "mid cap", "small cap"],
                ["mutual-funds", "stocks"],
            ),
            (
                "sip-in-falling-market",
                "SIP in a falling market",
                "Why it actually helps you",
                "When markets fall, your fixed SIP buys more units at lower prices — rupee cost averaging at its best. "
                "The worst thing to do in a crash is stop your SIP; continuing through downturns is how long-term investors win.",
                ["market fall", "bear market", "accumulation"],
                ["mutual-funds"],
            ),
            (
                "how-to-pick-a-mutual-fund",
                "How to pick a mutual fund",
                "What to look for",
                "Check expense ratio, 5–10 year returns vs benchmark, fund manager tenure, and whether the category matches your goal. "
                "Do not chase last year's top performer — consistency and low cost matter more than one hot year.",
                ["fund selection", "track record", "benchmark"],
                ["mutual-funds"],
            ),
            (
                "how-to-read-mf-fact-sheet",
                "How to read a mutual fund fact sheet",
                "What to look for on the fact sheet",
                "The monthly fact sheet shows top holdings, sector allocation, expense ratio, and performance vs benchmark. "
                "Spend 10 minutes on it before investing — if you cannot understand it, stick to a simple index fund.",
                ["fact sheet", "holdings", "portfolio", "AMFI"],
                ["mutual-funds"],
            ),
            (
                "kyc-and-pan",
                "KYC and PAN",
                "What you need to start investing",
                "SEBI requires KYC (Know Your Customer) before you buy mutual funds or open a demat account — PAN, Aadhaar, bank proof, and a photo. "
                "Complete e-KYC once through your broker or fund app; it is valid across platforms and usually takes under 10 minutes.",
                ["KYC", "PAN", "Aadhaar", "e-KYC", "account opening"],
                ["mutual-funds", "stocks"],
            ),
            (
                "amfi-and-sebi",
                "AMFI and SEBI",
                "Who protects your money",
                "SEBI regulates mutual funds in India; AMFI is the industry body that sets standards and provides investor resources. "
                "Your money in a registered fund is held separately by a custodian — the AMC cannot run away with it even if the company fails.",
                ["SEBI", "AMFI", "regulation", "investor protection"],
                ["mutual-funds"],
            ),
        ],
    ),
    (
        "government-schemes",
        [
            (
                "ppf",
                "PPF",
                "The safest long term investment",
                "Public Provident Fund (PPF) is a 15-year government-backed scheme with tax-free returns — currently around 7–8%. "
                "Contributions up to ₹1.5 lakh/year qualify for 80C; ideal for conservative long-term wealth building.",
                ["public provident fund", "80C", "tax free", "15 year"],
                ["fd"],
            ),
            (
                "epf",
                "EPF",
                "The money your employer adds every month",
                "Employee Provident Fund (EPF) deducts 12% of your basic salary — your employer matches another 12%. "
                "It is forced retirement savings with tax benefits; check your UAN passbook on the EPFO portal to track it.",
                ["EPFO", "UAN", "employer contribution", "retirement"],
                [],
            ),
            (
                "vpf",
                "VPF",
                "Voluntarily adding more to your EPF",
                "Voluntary Provident Fund (VPF) lets you contribute more than the mandatory 12% to EPF at the same rate and tax treatment. "
                "If you want safe, tax-efficient savings beyond 80C limits on PPF, VPF is worth considering while employed.",
                ["voluntary PF", "extra contribution", "EPF top-up"],
                [],
            ),
            (
                "nps",
                "NPS",
                "Retirement savings with a tax benefit",
                "National Pension System (NPS) is a long-term retirement account with extra ₹50,000 tax deduction under 80CCD(1B). "
                "Part of the corpus must buy an annuity at 60 — good for disciplined retirement saving, not for short-term goals.",
                ["national pension system", "80CCD", "retirement", "pension"],
                [],
            ),
            (
                "sovereign-gold-bonds",
                "Sovereign Gold Bonds",
                "Gold without the locker",
                "SGBs are RBI-issued bonds linked to gold price plus 2.5% annual interest — no storage worry or making charges. "
                "Held till maturity, capital gains are tax-free; you can buy through banks when the RBI opens a tranche.",
                ["SGB", "RBI", "gold bond", "sovereign"],
                ["gold"],
            ),
            (
                "nsc",
                "NSC",
                "Post office savings explained",
                "National Savings Certificate (NSC) is a 5-year post office scheme with 80C benefit and fixed interest. "
                "Interest is taxable but deemed reinvested for 80C in subsequent years — simple and safe for conservative savers.",
                ["national savings certificate", "post office", "80C"],
                ["fd"],
            ),
            (
                "sukanya-samriddhi-yojana",
                "Sukanya Samriddhi Yojana",
                "For a daughter's future",
                "SSY is a government scheme for a girl child under 10 — high tax-free interest and 80C benefit until she turns 21. "
                "Deposits up to ₹1.5 lakh/year; one of the best safe options for a daughter's education or marriage fund.",
                ["SSY", "girl child", "80C", "tax free"],
                ["fd"],
            ),
            (
                "pm-vaya-vandana-yojana",
                "PM Vaya Vandana Yojana",
                "For retirement income",
                "PMVVY is an LIC-administered pension scheme for seniors 60+ — guaranteed pension for 10 years against a lump sum. "
                "Useful for retirees wanting predictable monthly income, though returns are modest compared to inflation.",
                ["pension", "senior citizen", "guaranteed income", "LIC"],
                ["fd"],
            ),
            (
                "rbi-floating-rate-bonds",
                "RBI Floating Rate Bonds",
                "Government backed, market linked",
                "RBI Floating Rate Savings Bonds pay interest linked to NSC rates, reset every six months — government-backed safety. "
                "Interest is fully taxable and there is a 7-year lock-in; good for conservative investors who want better than savings account rates.",
                ["floating rate", "RBI bonds", "government", "7 year lock-in"],
                ["fd"],
            ),
        ],
    ),
    (
        "fixed-income",
        [
            (
                "fixed-deposit",
                "Fixed Deposit",
                "How it works, when to use it",
                "An FD locks your money with a bank for a fixed period at a guaranteed rate — typically 6–8% from major banks. "
                "Use FDs for goals 1–3 years away where you cannot afford volatility; remember interest above ₹40,000/year attracts TDS.",
                ["FD", "bank deposit", "guaranteed", "lock-in"],
                ["fd"],
            ),
            (
                "recurring-deposit",
                "Recurring Deposit",
                "SIP for your savings account",
                "An RD lets you deposit a fixed amount monthly into a bank for a set tenure — disciplined saving with a known maturity value. "
                "Returns are similar to FDs; good for building a vacation fund or down payment without market risk.",
                ["RD", "monthly deposit", "post office RD", "discipline"],
                ["fd", "savings"],
            ),
            (
                "debt-mutual-funds",
                "Debt mutual funds",
                "FD alternative with better returns",
                "Debt mutual funds invest in government and corporate bonds — potentially better post-tax returns than FDs for those in higher tax slabs. "
                "Not guaranteed like FD; choose short-duration or liquid funds for lower interest-rate risk.",
                ["debt fund", "bond fund", "FD alternative"],
                ["mutual-funds", "fd"],
            ),
            (
                "liquid-funds",
                "Liquid funds",
                "Parking money smartly",
                "Liquid funds invest in very short-term debt — usually redeemable in 1 business day with low volatility. "
                "Better than leaving lakhs idle in a savings account; useful for emergency funds beyond immediate cash needs.",
                ["liquid fund", "parking", "overnight", "low risk"],
                ["mutual-funds", "savings"],
            ),
            (
                "corporate-bonds",
                "Corporate bonds",
                "Lending to companies",
                "Corporate bonds are loans you give to companies for interest payments — higher yield than government bonds, more credit risk. "
                "Check the company's rating (AAA to D) before buying; never chase yield without understanding default risk.",
                ["corporate debt", "yield", "credit risk", "bond"],
                ["fd"],
            ),
            (
                "government-securities",
                "Government securities (G-Secs)",
                "Lending to the government",
                "G-Secs are bonds issued by the Government of India — the safest debt in the country, backed by sovereign guarantee. "
                "Retail investors can buy through RBI Retail Direct or gilt mutual funds without needing crores.",
                ["gilt", "government bond", "RBI Retail Direct", "sovereign"],
                ["mutual-funds", "fd"],
            ),
            (
                "bond-ratings",
                "Bond ratings",
                "How to know if a bond is safe",
                "CRISIL, ICRA, and CARE rate bonds from AAA (safest) to D (default) — lower rating means higher yield but real default risk. "
                "If a bond offers 12% when FDs offer 7%, ask why; the rating tells you how much extra risk you are taking.",
                ["CRISIL", "credit rating", "AAA", "default risk"],
                ["fd"],
            ),
        ],
    ),
    (
        "stocks",
        [
            (
                "what-is-a-stock",
                "What is a stock",
                "Owning a piece of a company",
                "A stock (share) is a tiny ownership stake in a company listed on NSE or BSE — if Reliance profits grow, your share can rise in value. "
                "You can also earn dividends when the company shares profits with shareholders.",
                ["share", "equity", "ownership", "listed company"],
                ["stocks"],
            ),
            (
                "ipo-explained",
                "IPO explained",
                "How a company gets listed",
                "An IPO (Initial Public Offering) is when a private company first sells shares to the public on the stock exchange. "
                "Retail investors can apply via UPI through their broker — but not every IPO is a good investment; read the prospectus.",
                ["IPO", "listing", "primary market", "prospectus"],
                ["stocks"],
            ),
            (
                "demat-account",
                "Demat account",
                "What it is and how to open one",
                "A demat account holds your shares electronically — like a bank account for stocks. "
                "Open one with a SEBI-registered broker (Zerodha, Groww, ICICI Direct) using PAN, Aadhaar, and bank details; most take 10 minutes online.",
                ["demat", "broker", "CDSL", "NSDL", "account opening"],
                ["stocks"],
            ),
            (
                "nse-vs-bse",
                "NSE vs BSE",
                "What's the difference",
                "NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are India's two main exchanges — most liquid stocks trade on both. "
                "Nifty tracks NSE's top 50; Sensex tracks BSE's top 30 — for you as an investor, the broker and stock matter more than the exchange.",
                ["NSE", "BSE", "stock exchange", "listing"],
                ["stocks"],
            ),
            (
                "nifty-50-and-sensex",
                "Nifty 50 and Sensex",
                "What they actually measure",
                "Nifty 50 and Sensex are baskets of India's largest companies — they show how the broad market is doing on a given day. "
                "When someone says 'market is up', they usually mean these indices — index funds let you own the whole basket cheaply.",
                ["Nifty", "Sensex", "index", "benchmark"],
                ["stocks", "mutual-funds"],
            ),
            (
                "market-cap",
                "Market cap",
                "Large, mid, small explained",
                "Market cap is a company's total value on the stock market — share price times number of shares. "
                "SEBI classifies large (top 100), mid (101–250), and small (251+) — each behaves differently in bull and bear markets.",
                ["market capitalisation", "large cap", "mid cap", "small cap"],
                ["stocks", "mutual-funds"],
            ),
            (
                "how-stock-prices-move",
                "How stock prices move",
                "Supply and demand",
                "Stock prices rise when more people want to buy than sell, and fall when selling pressure dominates — driven by company results, news, and sentiment. "
                "In the short term, prices can be irrational; over years, profits and growth tend to pull prices toward reality.",
                ["supply demand", "price movement", "volatility", "sentiment"],
                ["stocks"],
            ),
            (
                "how-to-read-a-stock",
                "How to read a stock",
                "PE ratio, EPS, book value basics",
                "P/E ratio compares price to earnings — a high P/E may mean optimism or overpricing. "
                "EPS (earnings per share) shows profit per share; book value is assets minus liabilities per share — use these together, never in isolation.",
                ["PE ratio", "EPS", "book value", "valuation"],
                ["stocks"],
            ),
            (
                "dividends",
                "Dividends",
                "Getting paid just for holding",
                "Some companies pay dividends — a share of profits cash-deposited to your account, common among mature firms like ITC or Coal India. "
                "Dividend yield matters for income seekers; growth companies often reinvest instead of paying out.",
                ["dividend yield", "payout", "income", "Dividend"],
                ["stocks"],
            ),
            (
                "stock-splits-and-bonuses",
                "Stock splits and bonuses",
                "What they mean for you",
                "A stock split cuts the share price and increases share count — you own the same value, just more shares at lower price. "
                "Bonus shares are free extra shares from accumulated profits — neither creates new wealth, but splits can improve liquidity.",
                ["stock split", "bonus issue", "face value", "corporate action"],
                ["stocks"],
            ),
            (
                "how-to-buy-first-stock",
                "How to buy your first stock",
                "Step by step",
                "Open a demat account, add funds, search the company on your broker app, and place a buy order during market hours (9:15–3:30). "
                "Start with one large-cap company or an index ETF you understand — avoid F&O and penny stocks until you have experience.",
                ["first stock", "buy order", "broker app", "beginner"],
                ["stocks"],
            ),
            (
                "how-to-research-a-company",
                "How to research a company",
                "Before buying",
                "Read the latest quarterly results, check debt levels, promoter holding, and whether revenue and profit are growing steadily. "
                "Compare P/E to industry peers and read what the company actually does — if you cannot explain the business in one sentence, skip it.",
                ["fundamental analysis", "research", "quarterly results"],
                ["stocks"],
            ),
            (
                "annual-reports",
                "Annual reports",
                "What to look for",
                "Every listed company publishes an annual report with audited financials, management commentary, and risk disclosures. "
                "Focus on revenue growth, profit margins, debt-to-equity, and cash flow — available free on BSE/NSE or the company website.",
                ["annual report", "financials", "audited accounts"],
                ["stocks"],
            ),
            (
                "promoter-holding",
                "Promoter holding",
                "Why it matters",
                "Promoter holding is the percentage owned by founders and their families — high holding (50%+) often signals skin in the game. "
                "Sudden promoter selling or pledging shares can be a red flag; check the shareholding pattern each quarter.",
                ["promoter stake", "shareholding", "insider", "pledging"],
                ["stocks"],
            ),
            (
                "esops-and-rsus",
                "ESOPs and RSUs",
                "Equity pay for salaried tech workers",
                "ESOPs (Employee Stock Options) and RSUs (Restricted Stock Units) let you buy or receive company shares as compensation — common at startups and IT firms. "
                "They can create significant wealth if your company does well, but concentration risk is real; understand vesting, exercise price, and tax at sale before counting paper gains as net worth.",
                ["ESOP", "RSU", "employee stock", "vesting", "startup equity"],
                ["stocks"],
            ),
        ],
    ),
    (
        "gold",
        [
            (
                "why-indians-trust-gold",
                "Why Indians trust gold",
                "History and reality",
                "Gold has been India's store of value for centuries — weddings, festivals, and inheritance all run on it. "
                "It still works as a hedge when rupee weakens or markets panic, but it is not a high-growth wealth builder on its own.",
                ["gold culture", "hedge", "tradition", "store of value"],
                ["gold"],
            ),
            (
                "physical-gold-vs-digital-gold",
                "Physical gold vs digital gold",
                "Pros and cons",
                "Physical gold (jewellery, coins) has making charges and storage risk; digital gold on apps has no locker but spreads can be wide. "
                "For investment (not wearing), SGBs or gold ETFs beat both — lower cost and no purity worry.",
                ["jewellery", "digital gold", "making charges", "purity"],
                ["gold"],
            ),
            (
                "sgb-best-way-to-own",
                "Sovereign Gold Bonds",
                "The best way to own gold",
                "SGBs give you gold price exposure plus 2.5% yearly interest — no making charges, and tax-free capital gains if held to 8-year maturity. "
                "Buy when RBI opens tranches through your bank; limit applies per person per year.",
                ["SGB", "best gold investment", "RBI", "tax free maturity"],
                ["gold"],
            ),
            (
                "gold-etfs",
                "Gold ETFs",
                "Stock market way to buy gold",
                "Gold ETFs trade on NSE like a stock — each unit represents roughly 1 gram of gold held in vaults. "
                "You need a demat account; good for tactical gold allocation without physical storage.",
                ["gold ETF", "exchange traded", "demat", "gram gold"],
                ["gold", "stocks"],
            ),
            (
                "gold-mutual-funds",
                "Gold mutual funds",
                "SIP into gold",
                "Gold mutual funds invest in gold ETFs or physical gold — you can SIP ₹500/month without a demat account. "
                "Useful for small, regular gold allocation alongside equity SIPs for diversification.",
                ["gold fund", "SIP gold", "fof", "allocation"],
                ["gold", "mutual-funds"],
            ),
            (
                "gold-in-a-crisis",
                "Gold in a crisis",
                "The hedge explained",
                "When stocks crash or the rupee falls, gold often holds or rises — it is the classic crisis hedge in Indian portfolios. "
                "It will not make you rich, but 5–10% gold allocation can soften the blow when equity bleeds.",
                ["hedge", "crisis", "safe haven", "portfolio"],
                ["gold"],
            ),
            (
                "gold-allocation",
                "Gold allocation",
                "How much gold should you hold",
                "Most planners suggest 5–10% of your portfolio in gold — enough to hedge, not so much that it drags long-term growth. "
                "Increase slightly if you have no physical gold at all; decrease if your family jewellery already IS your gold allocation.",
                ["allocation", "portfolio percentage", "5-10 percent"],
                ["gold"],
            ),
        ],
    ),
    (
        "real-estate",
        [
            (
                "renting-vs-buying",
                "Renting vs buying",
                "The real math for India",
                "Buying makes sense when EMI is close to rent AND you plan to stay 7+ years — otherwise renting plus investing the difference often wins. "
                "In Mumbai or Bangalore, run the full math including down payment, maintenance, and opportunity cost of locked capital.",
                ["rent vs buy", "EMI", "home ownership", "math"],
                [],
            ),
            (
                "how-real-estate-returns",
                "How real estate generates returns",
                "How real estate actually generates returns",
                "Real estate returns come from price appreciation and rental yield — but stamp duty, maintenance, and vacancy eat into gains. "
                "Indian property often returns 5–8% annualised after costs, not the 'double every 5 years' stories you hear at dinners.",
                ["appreciation", "rental yield", "property returns"],
                [],
            ),
            (
                "reits",
                "REITs",
                "Owning real estate without buying property",
                "REITs (Real Estate Investment Trusts) let you buy units of commercial property portfolios on the stock exchange — like mutual funds for office buildings. "
                "You get rental income as dividends with much lower entry than buying an entire flat.",
                ["REIT", "commercial property", "rental income", "listed"],
                ["stocks"],
            ),
            (
                "invits",
                "InvITs",
                "Infrastructure without buying a toll road",
                "InvITs (Infrastructure Investment Trusts) work like REITs but for assets like highways, power grids, and pipelines — you earn from tolls and tariffs as dividends. "
                "Listed on NSE/BSE with lower entry than physical infrastructure; yields vary and cash flows depend on traffic, regulation, and maintenance.",
                ["InvIT", "infrastructure", "toll road", "dividend yield", "highway"],
                ["stocks"],
            ),
            (
                "home-loan-basics",
                "Home loan basics",
                "EMI, interest, tenure explained",
                "A home loan EMI depends on loan amount, interest rate, and tenure — a ₹50 lakh loan at 8.5% for 20 years means roughly ₹43,000/month. "
                "Most of early EMIs go to interest, not principal; prepayment in the first 5 years saves the most.",
                ["home loan", "EMI", "interest rate", "tenure"],
                [],
            ),
            (
                "prepaying-home-loan",
                "Prepaying a home loan",
                "When it makes sense",
                "Prepaying saves future interest — especially when rates are high and you have no better use for the money. "
                "If you can earn 12% in equity over the long term, prepaying a 7% loan may not be optimal; do the comparison before lump-sum prepayment.",
                ["prepayment", "foreclosure", "interest saving"],
                [],
            ),
            (
                "commercial-vs-residential",
                "Commercial vs residential",
                "Which is better",
                "Commercial property often yields higher rent (8–10%) but needs larger capital and has vacancy risk. "
                "Residential is easier to understand and finance but rental yields in India are often just 2–3% — appreciation drives most returns.",
                ["commercial property", "residential", "rental yield"],
                [],
            ),
            (
                "real-estate-risks",
                "Real estate risks",
                "Illiquidity, maintenance, disputes",
                "Property is illiquid — selling can take months and involves broker fees and capital gains tax. "
                "Legal disputes, society issues, and unexpected repairs are common; never put all your wealth in one illiquid asset.",
                ["illiquidity", "legal risk", "maintenance", "disputes"],
                [],
            ),
        ],
    ),
    (
        "tax-basics",
        [
            (
                "income-tax-slabs",
                "Income tax slabs",
                "How income tax works in India",
                "India taxes salary in slabs — higher income brackets pay a higher percentage on the portion above each threshold. "
                "Your CTC is not your taxable income; deductions and exemptions reduce what actually gets taxed.",
                ["tax slabs", "income tax", "taxable income", "ITR"],
                [],
            ),
            (
                "new-vs-old-tax-regime",
                "New vs old tax regime",
                "Which is better for you",
                "The new regime has lower rates but almost no deductions; the old regime keeps 80C, HRA, and other exemptions. "
                "Salaried people with home loans and heavy 80C investments often still win on the old regime — run both calculations.",
                ["new regime", "old regime", "deductions", "comparison"],
                [],
            ),
            (
                "section-80c",
                "Section 80C",
                "12 ways to save ₹1.5 lakh in tax",
                "Section 80C lets you deduct up to ₹1.5 lakh from taxable income — PPF, ELSS, EPF, life insurance premium, home loan principal, and more. "
                "Plan your 80C early in the year; do not scramble in March with random investments you do not need.",
                ["80C", "tax deduction", "PPF", "ELSS", "EPF"],
                ["mutual-funds", "fd"],
            ),
            (
                "section-80d",
                "Section 80D",
                "Health insurance tax benefit",
                "Section 80D gives deduction for health insurance premiums — up to ₹25,000 for self and family, more for senior parents. "
                "Buy adequate health cover first for protection; the tax saving is a bonus, not the reason to insure.",
                ["80D", "health insurance", "medical premium", "deduction"],
                [],
            ),
            (
                "hra-exemption",
                "HRA exemption",
                "How salaried people save tax on rent",
                "If you rent and receive HRA from your employer, part of it may be tax-free based on salary, rent paid, and city. "
                "Keep rent receipts and landlord PAN if rent exceeds ₹1 lakh/year — your employer or CA can calculate the exempt portion.",
                ["HRA", "house rent allowance", "rent receipt", "exemption"],
                [],
            ),
            (
                "ltcg",
                "LTCG",
                "Long term capital gains tax explained",
                "LTCG applies when you sell investments held long enough — equity held over 1 year: 12.5% above ₹1.25 lakh gains per year. "
                "Debt and property have different holding periods and rates; know your asset type before selling.",
                ["long term capital gains", "equity tax", "holding period"],
                ["mutual-funds", "stocks"],
            ),
            (
                "stcg",
                "STCG",
                "Short term capital gains tax explained",
                "STCG hits when you sell equity within one year — taxed at 20% on gains. "
                "Debt fund STCG rules changed in 2024; check current rules before redeeming — frequent trading triggers STCG quickly.",
                ["short term capital gains", "equity tax", "trading"],
                ["mutual-funds", "stocks"],
            ),
            (
                "tds-on-fd-interest",
                "TDS on FD interest",
                "What happens and how to avoid it",
                "Banks deduct 10% TDS if FD interest from one branch exceeds ₹40,000/year (₹50,000 for seniors). "
                "Submit Form 15G/15H if your total income is below taxable limit to avoid TDS; claim refund via ITR if wrongly deducted.",
                ["TDS", "FD interest", "Form 15G", "Form 15H"],
                ["fd"],
            ),
            (
                "tax-loss-harvesting",
                "Tax loss harvesting",
                "Using your losses to pay less tax",
                "If you have losing stocks or funds, selling them can offset capital gains elsewhere in the same year — legally reducing tax. "
                "Do not sell good investments just for tax; harvest only genuine losers you wanted to exit anyway.",
                ["loss offset", "capital loss", "tax planning"],
                ["stocks", "mutual-funds"],
            ),
            (
                "filing-itr",
                "Filing ITR",
                "Why you must file even if tax is zero",
                "Filing Income Tax Return creates an official record of your income — needed for visa, home loans, and startup funding. "
                "Even if TDS covered your tax, file ITR-1 or ITR-2 by the July deadline to avoid penalties and enable refunds.",
                ["ITR", "income tax return", "filing deadline", "refund"],
                [],
            ),
            (
                "form-16-vs-form-26as",
                "Form 16 vs Form 26AS",
                "What they are",
                "Form 16 is your employer's TDS certificate for salary; Form 26AS is the full tax credit statement from the IT portal showing all TDS and tax payments. "
                "Match both before filing — discrepancies mean wrong tax credit or missing refund.",
                ["Form 16", "Form 26AS", "TDS certificate", "AIS"],
                [],
            ),
            (
                "tax-on-mf-returns",
                "Tax on mutual fund returns",
                "Equity vs debt difference",
                "Equity funds: LTCG after 1 year at 12.5% above exemption; debt funds taxed per your slab on gains. "
                "Fund type matters more than amount — check whether your fund is classified equity or debt before redeeming.",
                ["mutual fund tax", "equity fund tax", "debt fund tax"],
                ["mutual-funds"],
            ),
            (
                "tax-on-gold",
                "Tax on gold",
                "SGB vs physical gold difference",
                "Physical and digital gold attract capital gains tax on sale; SGBs held to maturity are tax-free on gains plus 2.5% interest taxed as income. "
                "Early SGB exit on exchange attracts LTCG like gold ETFs — plan holding period accordingly.",
                ["gold tax", "SGB tax", "capital gains gold"],
                ["gold"],
            ),
            (
                "tax-on-epf-withdrawal",
                "Tax on EPF withdrawal",
                "When it's taxable",
                "EPF withdrawal is tax-free after 5 years of continuous service if you have a valid UAN linked to Aadhaar. "
                "Withdrawing before 5 years makes employer contribution and interest taxable — avoid breaking EPF unless absolutely necessary.",
                ["EPF tax", "PF withdrawal", "5 year rule", "UAN"],
                [],
            ),
        ],
    ),
    (
        "insurance",
        [
            (
                "insurance-is-not-investment",
                "Insurance is not investment",
                "The biggest mistake Indians make",
                "Insurance protects against bad events; investment grows wealth — mixing them (ULIPs, endowment plans) usually gives poor returns AND poor cover. "
                "Buy term insurance for protection and mutual funds for growth — keep them separate.",
                ["insurance mistake", "ULIP", "endowment", "protection"],
                ["mutual-funds"],
            ),
            (
                "term-insurance",
                "Term insurance",
                "The only life insurance you need",
                "Term insurance pays your family a lump sum if you die during the policy term — pure protection, no maturity payout, lowest premium. "
                "A ₹1 crore cover for a 30-year-old might cost ₹10,000–15,000/year — cheapest way to protect dependents.",
                ["term plan", "life cover", "pure protection", "death benefit"],
                [],
            ),
            (
                "term-cover-formula",
                "Term cover formula",
                "How much term cover do you need",
                "A simple rule: 10–15 times your annual income, or enough to cover outstanding loans plus 10 years of family expenses. "
                "A ₹20 lakh/year earner with ₹40 lakh home loan might need ₹1.5–2 crore cover — use an online calculator to refine.",
                ["sum assured", "cover amount", "10x income", "protection gap"],
                [],
            ),
            (
                "health-insurance",
                "Health insurance",
                "Why company cover is not enough",
                "Employer health cover ends when you change jobs or retire — a personal policy covers that gap. "
                "Buy at least ₹10–25 lakh family floater while young and healthy; pre-existing disease waiting periods apply if you delay.",
                ["health policy", "mediclaim", "family floater", "corporate cover"],
                [],
            ),
            (
                "critical-illness-cover",
                "Critical illness cover",
                "What it covers and when you need it",
                "Critical illness policies pay a lump sum on diagnosis of serious conditions like cancer or heart attack — use it for treatment beyond regular health insurance. "
                "Consider it if you have dependants and insufficient emergency corpus for a ₹10–20 lakh medical shock.",
                ["critical illness", "cancer cover", "lump sum diagnosis"],
                [],
            ),
            (
                "accidental-disability-cover",
                "Accidental disability cover",
                "The most ignored insurance",
                "Accident disability cover pays if an accident leaves you unable to work — regular life insurance may not cover disability. "
                "Especially important if you commute daily or work in physical roles; often cheap as a rider on term insurance.",
                ["disability cover", "accident insurance", "PA cover"],
                [],
            ),
            (
                "comparing-insurance-policies",
                "Comparing insurance policies",
                "What to look for",
                "Compare claim settlement ratio, premium for same cover, exclusions, and waiting periods — not just the agent's pitch. "
                "Use IRDAI-published CSR data; a cheap policy with 60% claim settlement is worse than a slightly costlier 98% insurer.",
                ["claim settlement", "policy comparison", "IRDAI", "exclusions"],
                [],
            ),
            (
                "claim-settlement-ratio",
                "Claim settlement ratio",
                "Why it matters",
                "Claim settlement ratio (CSR) is the percentage of claims an insurer paid — above 97% is generally good for life insurance. "
                "High CSR means your family's claim is more likely to be honoured when it matters most.",
                ["CSR", "claims paid", "insurer reliability"],
                [],
            ),
            (
                "ulip-avoid",
                "ULIP",
                "Why you should avoid it",
                "ULIPs mix insurance with market investment — high charges, long lock-in, and insurance cover is usually inadequate for the premium. "
                "Separate term plan plus direct mutual fund SIP almost always beats a ULIP over 10 years on both cover and returns.",
                ["ULIP", "unit linked", "avoid", "high charges"],
                ["mutual-funds"],
            ),
            (
                "endowment-plans-avoid",
                "Endowment plans",
                "Why you should avoid them",
                "Endowment plans promise insurance plus savings but deliver low returns (often 4–6%) and weak life cover for the premium paid. "
                "Agents push them for commissions — a term plan plus PPF or mutual fund gives better protection and growth.",
                ["endowment", "money back policy", "traditional plan", "avoid"],
                ["mutual-funds", "fd"],
            ),
        ],
    ),
    (
        "retirement-planning",
        [
            (
                "retirement-corpus-needed",
                "Retirement corpus needed",
                "How much do you need to retire",
                "Estimate monthly expenses in retirement (in today's rupees), multiply by 25–30, and adjust for inflation — a couple needing ₹1 lakh/month today might need ₹3–5 crore. "
                "Start with a rough number; refine as your lifestyle and goals clarify.",
                ["retirement number", "corpus", "FIRE", "expenses"],
                ["mutual-funds"],
            ),
            (
                "four-percent-rule",
                "The 4% rule",
                "How to not outlive your money",
                "The 4% rule suggests you can withdraw 4% of your retirement corpus yearly with low chance of running out over 30 years — ₹5 crore means ₹20 lakh/year. "
                "It is a US-centric guideline; in India, account for higher inflation and healthcare costs — 3.5% may be safer.",
                ["withdrawal rate", "retirement spending", "sustainability"],
                ["mutual-funds"],
            ),
            (
                "retirement-corpus-calculation",
                "Retirement corpus calculation",
                "How to calculate yours",
                "Work backwards: desired monthly income × 12 × 25 (or use an online calculator with 6–7% inflation and 10% pre-retirement returns). "
                "A 35-year-old wanting ₹1.5 lakh/month at 60 needs roughly ₹4–6 crore — the SIP required depends on years left.",
                ["retirement calculator", "SIP for retirement", "goal planning"],
                ["mutual-funds"],
            ),
            (
                "epf-ppf-nps-trifecta",
                "EPF + PPF + NPS",
                "The retirement trifecta",
                "EPF (employer-matched), PPF (tax-free safe growth), and NPS (extra tax deduction) form a strong retirement base for salaried Indians. "
                "They will not alone fund a lavish retirement — add equity mutual fund SIPs for growth beyond this safe core.",
                ["EPF", "PPF", "NPS", "retirement stack"],
                ["mutual-funds", "fd"],
            ),
            (
                "annuities",
                "Annuities",
                "Guaranteed income after retirement",
                "An annuity converts a lump sum into fixed monthly income for life — useful if you fear outliving your corpus. "
                "Returns are often low (5–6%) and inflation erodes purchasing power; use for part of corpus, not all.",
                ["pension annuity", "guaranteed income", "retirement payout"],
                ["fd"],
            ),
            (
                "senior-citizen-savings-scheme",
                "Senior Citizen Savings Scheme",
                "Post retirement income",
                "SCSS offers government-backed interest (around 8%+) for investors 60+ with 5-year tenure and tax benefits under 80C. "
                "Maximum investment ₹30 lakh — a solid safe pillar for retirees alongside mutual fund SWPs.",
                ["SCSS", "senior citizen", "post office", "retirement income"],
                ["fd"],
            ),
            (
                "healthcare-costs-retirement",
                "Healthcare costs in retirement",
                "The hidden expense",
                "Medical inflation in India runs 10–14% — a procedure costing ₹5 lakh today may cost ₹30 lakh in 20 years. "
                "Maintain health insurance lifelong and build a separate medical buffer in your retirement corpus.",
                ["medical inflation", "health costs", "retirement risk"],
                [],
            ),
            (
                "inflation-in-retirement",
                "Inflation in retirement",
                "Why your corpus needs to grow",
                "Even after retiring, expenses rise with inflation — a fixed ₹1 lakh/month feels like ₹50,000 in 12 years at 6% inflation. "
                "Keep part of retirement corpus in equity or balanced funds, not all in FD, to fight inflation.",
                ["retirement inflation", "purchasing power", "longevity risk"],
                ["mutual-funds", "fd"],
            ),
            (
                "when-to-start-retirement",
                "When to start retirement planning",
                "The answer is now",
                "Retirement planning starts with your first salary — EPF begins automatically, but you must add PPF, NPS, and equity SIP yourself. "
                "Every year you delay roughly doubles the monthly SIP needed to reach the same corpus at 60.",
                ["start early", "retirement planning", "first job"],
                ["mutual-funds"],
            ),
        ],
    ),
    (
        "behavioural-finance",
        [
            (
                "why-people-dont-invest",
                "Why people don't invest",
                "The psychology of inaction",
                "Fear of losing money, overwhelm from jargon, and 'I'll start next month' keep smart earners on the sidelines for years. "
                "Starting with ₹500 in an index fund beats waiting until you feel like an expert — action cures anxiety.",
                ["inaction", "fear", "procrastination", "beginner"],
                ["mutual-funds"],
            ),
            (
                "loss-aversion",
                "Loss aversion",
                "Why losing ₹1k hurts more than gaining ₹1k",
                "Humans feel losses about twice as strongly as gains — so a ₹10,000 portfolio drop feels worse than a ₹10,000 rise feels good. "
                "This makes people sell in panic at the bottom; knowing the bias helps you stick to your SIP.",
                ["loss aversion", "psychology", "panic selling"],
                ["mutual-funds", "stocks"],
            ),
            (
                "herd-mentality",
                "Herd mentality",
                "Why everyone buying something is a warning sign",
                "When colleagues, relatives, and WhatsApp groups all push one stock or crypto, the smart money may already be exiting. "
                "If you cannot explain why YOU are buying — not why others are — step back.",
                ["herd behaviour", "crowd", "bubble", "FOMO"],
                ["crypto", "stocks"],
            ),
            (
                "fomo-investing",
                "FOMO investing",
                "The most expensive mistake",
                "FOMO (fear of missing out) drives buying at peaks — bitcoin at ₹60 lakh, penny stocks after 500% rallies. "
                "Missed gains cost nothing; losses from buying high are real — there is always another opportunity.",
                ["FOMO", "chasing returns", "peak buying"],
                ["crypto", "stocks"],
            ),
            (
                "recency-bias",
                "Recency bias",
                "Why last year's winner is rarely next year's winner",
                "We overweight recent events — last year's top fund or sector feels like it will win forever. "
                "Mean reversion is real; chasing last year's performer often means buying high and switching at the wrong time.",
                ["recency bias", "performance chasing", "mean reversion"],
                ["mutual-funds"],
            ),
            (
                "anchoring",
                "Anchoring",
                "Why you hold losing stocks too long",
                "Anchoring is clinging to your purchase price — 'I'll sell when it comes back to ₹500' even when fundamentals broke. "
                "The market does not know your buy price; ask whether you'd buy the stock today at this price.",
                ["anchoring", "holding losers", "buy price"],
                ["stocks"],
            ),
            (
                "overconfidence",
                "Overconfidence",
                "Why most people think they can beat the market",
                "Most drivers think they are above average; most investors think they can pick winners — statistics say otherwise. "
                "Humility favours index funds and diversification over betting your future on stock tips.",
                ["overconfidence", "stock picking", "market timing"],
                ["mutual-funds", "stocks"],
            ),
            (
                "market-crashes",
                "Market crashes",
                "What to do when everything falls",
                "When Nifty drops 20–30%, headlines scream disaster — but crashes are normal every few years. "
                "Do not stop SIPs, do not leverage to buy more unless you have spare cash and years to recover; stay the course if goals are long term.",
                ["crash", "bear market", "correction", "stay invested"],
                ["mutual-funds", "stocks"],
            ),
            (
                "investor-vs-speculator",
                "Investor vs speculator",
                "Two very different games",
                "Investors own assets for years based on fundamentals; speculators bet on short-term price moves — trading, F&O, meme stocks. "
                "Building wealth is an investor's game; speculating is entertainment with expensive tickets.",
                ["investing", "speculation", "trading", "long term"],
                ["stocks", "mutual-funds"],
            ),
            (
                "lifestyle-inflation",
                "Lifestyle inflation",
                "Why salary hikes don't make you richer",
                "Every raise triggers a bigger flat, nicer car, more dining — expenses grow with income and savings stay flat. "
                "When salary jumps, increase SIP by half the raise before upgrading lifestyle — that is how earners become wealthy.",
                ["lifestyle creep", "salary hike", "expenses", "wealth gap"],
                ["savings", "mutual-funds"],
            ),
            (
                "advice-from-family-friends",
                "Advice from family and friends",
                "Why financial advice from family and friends is dangerous",
                "Uncle's stock tip or cousin's insurance policy worked in their context — not necessarily yours. "
                "Well-meaning advice often comes from outdated products or commission incentives; learn concepts and decide for your goals.",
                ["unsolicited advice", "relatives", "tips", "bias"],
                [],
            ),
        ],
    ),
    (
        "advanced-investing",
        [
            (
                "portfolio-construction",
                "Portfolio construction",
                "Building a complete portfolio",
                "A complete portfolio matches equity, debt, gold, and cash to your goals and timeline — not random funds from articles. "
                "Start simple: one equity index fund, one debt fund, small gold allocation; add complexity only when basics are solid.",
                ["portfolio", "asset mix", "construction", "holistic"],
                ["mutual-funds", "gold", "fd"],
            ),
            (
                "asset-allocation",
                "Asset allocation",
                "How to split across asset classes",
                "Asset allocation — how much in equity vs debt vs gold — drives most of your returns and volatility. "
                "A common rule: 100 minus your age in equity (65% at 35), adjusted for risk appetite and goal timeline.",
                ["allocation", "equity debt split", "age rule"],
                ["mutual-funds", "fd", "gold"],
            ),
            (
                "rebalancing",
                "Rebalancing",
                "Why and how to rebalance your portfolio",
                "When equity runs up, it becomes a larger share than planned — rebalancing sells some winners and buys laggards to restore target allocation. "
                "Review once a year or when any asset drifts 5%+ from target; discipline beats trying to predict cycles.",
                ["rebalance", "drift", "discipline", "annual review"],
                ["mutual-funds", "gold"],
            ),
            (
                "factor-investing",
                "Factor investing",
                "Value, momentum, quality explained",
                "Factor investing targets traits like low P/E (value), strong earnings (quality), or recent winners (momentum) — beyond plain index investing. "
                "Factor funds exist in India but require longer conviction; index funds remain the simpler default.",
                ["value", "momentum", "quality", "factor fund"],
                ["mutual-funds", "stocks"],
            ),
            (
                "international-investing",
                "International investing",
                "US stocks from India",
                "You can invest in US markets via international mutual funds or some brokers — diversification beyond Indian economy and rupee. "
                "Regulatory limits and currency risk apply; treat as 10–20% satellite allocation, not core portfolio.",
                ["US stocks", "international fund", "global diversification"],
                ["mutual-funds"],
            ),
            (
                "dollar-cost-averaging-us",
                "Dollar cost averaging in US markets",
                "Rupee cost averaging for global stocks",
                "SIP into international funds works like rupee cost averaging — you buy more units when US markets fall and rupee strengthens. "
                "Avoid lump-sum timing the NASDAQ; monthly investing smooths currency and market volatility.",
                ["international SIP", "US market", "currency risk"],
                ["mutual-funds"],
            ),
            (
                "etfs-vs-index-funds",
                "ETFs vs index funds",
                "The difference",
                "Both track an index cheaply — ETFs trade on exchange like stocks (need demat); index mutual funds buy directly from AMC. "
                "ETFs can have slight tracking difference and liquidity gaps; index funds suit SIP without demat hassle.",
                ["ETF", "index fund", "tracking", "demat"],
                ["mutual-funds", "stocks"],
            ),
            (
                "sectoral-thematic-funds",
                "Sectoral and thematic funds",
                "When to use them",
                "Sector funds bet on one industry (banking, IT, pharma) — high risk, high reward if you call the cycle right. "
                "Most beginners should avoid; if used, cap at 5–10% of portfolio and know you are making a tactical bet.",
                ["sector fund", "thematic", "banking fund", "IT fund"],
                ["mutual-funds"],
            ),
            (
                "multi-asset-funds",
                "Multi-asset funds",
                "One fund for everything",
                "Multi-asset funds hold equity, debt, and sometimes gold in one product — automatic diversification for hands-off investors. "
                "Convenient but check allocation drift and fees; a DIY two-fund portfolio may be cheaper.",
                ["multi asset", "hybrid", "all in one", "diversified fund"],
                ["mutual-funds", "gold"],
            ),
            (
                "passive-vs-active-investing",
                "Passive vs active investing",
                "The evidence",
                "Passive investing tracks an index at low cost; active funds pay managers to beat the market — most fail over 10 years after fees. "
                "For most Indians, a Nifty index fund as core holding plus active only where you have genuine edge is sensible.",
                ["passive", "active", "index vs managed", "evidence"],
                ["mutual-funds"],
            ),
            (
                "crypto-explained",
                "Crypto explained",
                "What it is — and why beginners should be cautious",
                "Cryptocurrency is digital money secured by blockchain — Bitcoin, Ethereum, and thousands of others trade 24/7 with extreme volatility. "
                "India taxes crypto gains at 30% with no loss offset; it is speculation, not investing — if you try it, keep under 5% of net worth and never borrow to buy.",
                ["bitcoin", "cryptocurrency", "blockchain", "crypto tax", "speculation"],
                ["crypto"],
            ),
            (
                "fno-and-derivatives",
                "F&O and derivatives",
                "Why beginners should stay away",
                "Futures and Options (F&O) are contracts betting on future prices — you can lose more than you put in, especially with options selling. "
                "Over 90% of retail F&O traders lose money in India per SEBI studies — build wealth with SIPs first; treat F&O as advanced speculation only.",
                ["F&O", "futures", "options", "derivatives", "leverage"],
                ["stocks"],
            ),
            (
                "forex-trading",
                "Forex trading",
                "Why it is speculation, not investing",
                "Forex trading bets on currency pairs like USD/INR with high leverage — tiny moves can wipe out your margin. "
                "RBI restricts retail forex to authorised channels; most 'get rich' forex schemes are illegal or scams — stick to rupee investments unless you have a genuine overseas need.",
                ["forex", "currency trading", "USD INR", "leverage", "speculation"],
                [],
            ),
        ],
    ),
    (
        "financial-planning",
        [
            (
                "what-is-a-financial-plan",
                "What is a financial plan",
                "And why you need one",
                "A financial plan maps your goals (home, retirement, child's education) to monthly actions — how much to save, insure, and invest. "
                "Without one, money leaks to random expenses and products; with one, every rupee has a job.",
                ["financial plan", "goals", "roadmap", "money map"],
                ["mutual-funds", "savings"],
            ),
            (
                "life-stages-and-money",
                "Life stages and money",
                "20s vs 30s vs 40s vs 50s",
                "Your 20s: build emergency fund and start SIPs. 30s: term insurance, home goal, child planning. "
                "40s–50s: peak earning — accelerate retirement, reduce debt; priorities shift but compounding rewards what you started early.",
                ["life stage", "20s 30s 40s", "priorities", "timeline"],
                ["mutual-funds", "savings"],
            ),
            (
                "money-and-marriage",
                "Money and marriage",
                "Joint finances explained",
                "Discuss income, debts, and goals before merging finances — joint account for shared expenses, separate accounts for personal spending often reduces conflict. "
                "Both partners need term insurance and nominees updated; financial transparency builds trust.",
                ["joint finances", "couple money", "marriage", "transparency"],
                ["savings"],
            ),
            (
                "planning-for-a-child",
                "Planning for a child",
                "Education costs in India",
                "An MBA or engineering seat that costs ₹25 lakh today may cost ₹80 lakh in 15 years at 8% education inflation. "
                "Start an equity SIP in the child's name or yours the year they are born — PPF or SSY for the safe portion.",
                ["child education", "education fund", "SSY", "college cost"],
                ["mutual-funds", "fd"],
            ),
            (
                "buying-a-car",
                "Buying a car",
                "Loan vs cash, new vs used",
                "Cars depreciate — a new car loses 15–20% the moment you drive out. "
                "If you must buy, compare total cost of car loan EMI vs paying cash and investing what would have been EMI; used cars 2–3 years old often beat new on value.",
                ["car loan", "depreciation", "new vs used", "EMI"],
                [],
            ),
            (
                "planning-a-vacation",
                "Planning a vacation",
                "Saving vs EMI",
                "Save ₹8,000/month for 10 months and take a ₹80,000 trip guilt-free — better than a travel EMI at 18% interest. "
                "Use a liquid fund or RD as a sinking fund; vacations are wants, not reasons for expensive debt.",
                ["vacation fund", "travel saving", "sinking fund", "no EMI"],
                ["savings", "fd"],
            ),
            (
                "job-loss-survival",
                "Job loss survival",
                "Financial survival guide",
                "An emergency fund of 6 months expenses is your first defence — cut discretionary spending immediately, pause SIPs only if absolutely necessary. "
                "Avoid redeeming long-term equity at a loss unless the fund is broken; prioritise health insurance continuity via personal policy.",
                ["layoff", "emergency", "job loss", "runway"],
                ["savings"],
            ),
            (
                "salary-negotiation",
                "Salary negotiation",
                "How to think about your CTC",
                "CTC is not take-home — understand basic, HRA, PF, and variable components before comparing offers. "
                "A ₹5 lakh hike matters less if it is mostly variable or in a higher tax bracket; negotiate fixed cash and employer PF contribution.",
                ["CTC", "salary hike", "take home", "offer letter"],
                [],
            ),
            (
                "side-income",
                "Side income",
                "How to think about freelancing money",
                "Freelance or consulting income is irregular — tax it as business or professional income, set aside 30% for tax and GST if applicable. "
                "Do not let lifestyle inflate with sporadic windfalls; route a fixed percentage to investments before spending.",
                ["freelance", "consulting", "gig income", "side hustle"],
                ["mutual-funds", "savings"],
            ),
            (
                "building-second-income-stream",
                "Building a second income stream",
                "Options for salaried Indians",
                "Second income from freelancing, rental, dividends, or a small business can accelerate FIRE — but needs time and skill investment. "
                "Do not neglect your primary career; build side income that scales without trading all your evenings for ₹500/hour.",
                ["passive income", "second income", "FIRE", "diversified earnings"],
                ["mutual-funds", "stocks"],
            ),
        ],
    ),
]


def build_concepts() -> list[dict[str, Any]]:
    """Flatten grouped seed data into ordered concept records."""
    concept_copy = _load_concept_copy()
    concepts: list[dict[str, Any]] = []
    sort_order = 1

    for group_slug, group_concepts in GROUPS:
        for seed in group_concepts:
            concept_id, title, tagline, explanation, keywords, investments = seed
            concepts.append(
                {
                    "id": concept_id,
                    "groupSlug": group_slug,
                    "title": title,
                    "tagline": tagline,
                    "explanation": layman(*concept_copy[concept_id])
                    if concept_id in concept_copy
                    else layman(explanation),
                    "exampleKey": EXAMPLE_KEY_OVERRIDES.get(concept_id, "default"),
                    "keywords": keywords,
                    "relatedInvestmentIds": investments,
                    "sortOrder": sort_order,
                }
            )
            sort_order += 1

    return concepts


def main() -> None:
    concepts = build_concepts()
    if len(concepts) != 159:
        raise SystemExit(f"Expected 159 concepts, got {len(concepts)}")

    OUTPUT.write_text(json.dumps(concepts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(concepts)} concepts to {OUTPUT}")


if __name__ == "__main__":
    main()
