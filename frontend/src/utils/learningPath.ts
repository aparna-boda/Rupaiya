import type { UserProfile } from '../types/profile';

export type LearningPriority = 'start' | 'core' | 'next' | 'later';

export interface LearningPathEntry {
  slug: string;
  priority: LearningPriority;
  reason: string;
}

const PRIORITY_ORDER: Record<LearningPriority, number> = {
  start: 0,
  core: 1,
  next: 2,
  later: 3,
};

const SAFE_PATH: LearningPathEntry[] = [
  { slug: 'money-fundamentals', priority: 'start', reason: 'Understand inflation and why savings alone lose ground' },
  { slug: 'saving', priority: 'start', reason: 'Build your emergency fund and kill expensive debt first' },
  { slug: 'insurance', priority: 'core', reason: 'Protect yourself before you grow money — term + health cover' },
  { slug: 'investing-basics', priority: 'core', reason: 'Learn risk vs return so you pick the right safe instruments' },
  { slug: 'fixed-income', priority: 'core', reason: 'FDs, debt funds, and liquid funds — your comfort zone' },
  { slug: 'government-schemes', priority: 'core', reason: 'PPF, EPF, NSC — government-backed, tax-efficient safety' },
  { slug: 'tax-basics', priority: 'next', reason: 'Keep more of what you earn through 80C and smart filing' },
  { slug: 'retirement-planning', priority: 'next', reason: 'Even safe investors need a long-term corpus plan' },
  { slug: 'financial-planning', priority: 'next', reason: 'Tie goals, insurance, and savings into one plan' },
  { slug: 'mutual-funds', priority: 'next', reason: 'Start with debt and liquid funds; add equity SIP only when ready' },
  { slug: 'gold', priority: 'next', reason: 'A small gold or SGB slice adds stability, not growth bets' },
  { slug: 'behavioural-finance', priority: 'next', reason: 'Avoid panic selling and product pitches from relatives' },
  { slug: 'real-estate', priority: 'later', reason: 'Big commitment — understand rent vs buy math first' },
  { slug: 'stocks', priority: 'later', reason: 'Direct stocks are high risk — not your starting point' },
  { slug: 'advanced-investing', priority: 'later', reason: 'Crypto, F&O, and forex are speculation — skip for now' },
];

const LOW_PATH: LearningPathEntry[] = SAFE_PATH.map((e) =>
  e.slug === 'mutual-funds'
    ? { ...e, reason: 'Mix debt funds with a small index SIP once basics are covered' }
    : e
);

const MEDIUM_PATH: LearningPathEntry[] = [
  { slug: 'money-fundamentals', priority: 'start', reason: 'Foundation — compounding, inflation, cash flow' },
  { slug: 'saving', priority: 'start', reason: 'Emergency fund and disciplined saving habits' },
  { slug: 'investing-basics', priority: 'core', reason: 'Risk, diversification, SIP, and goal-setting' },
  { slug: 'mutual-funds', priority: 'core', reason: 'Your main wealth-building tool as a salaried Indian' },
  { slug: 'insurance', priority: 'core', reason: 'Term + health insurance alongside investing' },
  { slug: 'tax-basics', priority: 'next', reason: '80C, LTCG, and filing — keep returns intact' },
  { slug: 'government-schemes', priority: 'next', reason: 'PPF, EPF, NPS for tax-efficient long-term savings' },
  { slug: 'fixed-income', priority: 'next', reason: 'Debt allocation for stability and short goals' },
  { slug: 'gold', priority: 'next', reason: '5–10% gold or SGB as a portfolio hedge' },
  { slug: 'retirement-planning', priority: 'next', reason: 'Work backwards from your retirement number' },
  { slug: 'financial-planning', priority: 'next', reason: 'Connect goals to monthly actions' },
  { slug: 'stocks', priority: 'next', reason: 'Direct equity once index SIP habit is solid' },
  { slug: 'behavioural-finance', priority: 'next', reason: 'Stay disciplined through market ups and downs' },
  { slug: 'real-estate', priority: 'later', reason: 'Run rent vs buy math before committing' },
  { slug: 'advanced-investing', priority: 'later', reason: 'International funds, rebalancing — after core is set' },
];

const HIGH_PATH: LearningPathEntry[] = [
  { slug: 'money-fundamentals', priority: 'start', reason: 'Still non-negotiable — even aggressive investors need basics' },
  { slug: 'investing-basics', priority: 'start', reason: 'Know what you are risking before chasing returns' },
  { slug: 'mutual-funds', priority: 'core', reason: 'Core equity SIP + sector/thematic only as satellite bets' },
  { slug: 'stocks', priority: 'core', reason: 'Direct equity and research skills for higher conviction' },
  { slug: 'advanced-investing', priority: 'core', reason: 'Asset allocation, rebalancing, international exposure' },
  { slug: 'tax-basics', priority: 'next', reason: 'Tax efficiency matters more as gains grow' },
  { slug: 'behavioural-finance', priority: 'next', reason: 'Overconfidence kills more high-risk portfolios than markets' },
  { slug: 'fixed-income', priority: 'next', reason: 'Debt and liquid funds for stability and rebalancing ammo' },
  { slug: 'gold', priority: 'next', reason: 'Hedge allocation during equity-heavy phases' },
  { slug: 'insurance', priority: 'next', reason: 'Do not skip protection while chasing returns' },
  { slug: 'saving', priority: 'next', reason: 'Emergency fund prevents forced selling in downturns' },
  { slug: 'government-schemes', priority: 'later', reason: 'PPF/NPS as tax-efficient safe sleeve, not core growth' },
  { slug: 'retirement-planning', priority: 'later', reason: 'Long horizon planning even for aggressive investors' },
  { slug: 'financial-planning', priority: 'later', reason: 'Goal-based allocation across risk levels' },
  { slug: 'real-estate', priority: 'later', reason: 'Illiquid — weigh against liquid portfolio returns' },
];

export const LEARNING_PATHS: Record<UserProfile['riskAppetite'], LearningPathEntry[]> = {
  safe: SAFE_PATH,
  low: LOW_PATH,
  medium: MEDIUM_PATH,
  high: HIGH_PATH,
};

export const RISK_LABELS: Record<UserProfile['riskAppetite'], string> = {
  safe: 'Safe investor',
  low: 'Low risk',
  medium: 'Balanced',
  high: 'High risk',
};

export const PRIORITY_LABELS: Record<LearningPriority, string> = {
  start: 'Start here',
  core: 'Core for you',
  next: 'Build next',
  later: 'Learn later',
};

export const PRIORITY_STYLES: Record<LearningPriority, string> = {
  start: 'bg-primary text-white',
  core: 'bg-secondary-soft text-secondary-dark',
  next: 'bg-sunken text-secondary-text',
  later: 'bg-transparent text-muted border border-border',
};

export function getLearningPath(risk: UserProfile['riskAppetite']): LearningPathEntry[] {
  return LEARNING_PATHS[risk];
}

export function getPathEntry(
  risk: UserProfile['riskAppetite'],
  slug: string
): LearningPathEntry | undefined {
  return LEARNING_PATHS[risk].find((e) => e.slug === slug);
}

export function sortGroupsByPath<T extends { slug: string }>(
  groups: T[],
  risk: UserProfile['riskAppetite']
): T[] {
  const path = LEARNING_PATHS[risk];
  const order = new Map(path.map((e, i) => [e.slug, i]));

  return [...groups].sort((a, b) => {
    const aOrder = order.get(a.slug) ?? 999;
    const bOrder = order.get(b.slug) ?? 999;
    return aOrder - bOrder;
  });
}

export function compareByPriority(
  risk: UserProfile['riskAppetite'],
  slugA: string,
  slugB: string
): number {
  const path = LEARNING_PATHS[risk];
  const a = path.find((e) => e.slug === slugA);
  const b = path.find((e) => e.slug === slugB);
  const aPri = a ? PRIORITY_ORDER[a.priority] : 99;
  const bPri = b ? PRIORITY_ORDER[b.priority] : 99;
  if (aPri !== bPri) return aPri - bPri;
  return path.findIndex((e) => e.slug === slugA) - path.findIndex((e) => e.slug === slugB);
}
