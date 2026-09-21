export interface StartHereStep {
  id: string;
  order: number;
  title: string;
  description: string;
  route: string;
  groupSlug?: string;
  conceptSlug?: string;
}

/** 12-step guided path for beginners — order matters. */
export const START_HERE_STEPS: StartHereStep[] = [
  {
    id: 'inflation',
    order: 1,
    title: 'Understand inflation',
    description: 'Why ₹100 today buys less tomorrow — the reason to invest at all.',
    route: '/learning',
    groupSlug: 'money-fundamentals',
    conceptSlug: 'inflation',
  },
  {
    id: 'emergency-fund',
    order: 2,
    title: 'Build an emergency fund',
    description: '6 months of expenses in a safe, liquid place before you invest.',
    route: '/learning',
    groupSlug: 'saving',
    conceptSlug: 'emergency-fund',
  },
  {
    id: 'term-insurance',
    order: 3,
    title: 'Get term insurance',
    description: 'Protect your family before you grow money — pure cover, not investment.',
    route: '/learning',
    groupSlug: 'insurance',
    conceptSlug: 'term-insurance',
  },
  {
    id: 'sip-basics',
    order: 4,
    title: 'Learn how SIP works',
    description: 'Small monthly amounts, automatic habit, compounding over time.',
    route: '/learning',
    groupSlug: 'investing-basics',
    conceptSlug: 'sip',
  },
  {
    id: 'first-sip',
    order: 5,
    title: 'Start your first SIP',
    description: 'Index or debt fund — pick an instrument that matches your risk.',
    route: '/grow',
  },
  {
    id: 'ppf',
    order: 6,
    title: 'Explore PPF',
    description: 'Tax-free, government-backed — a safe long-term pillar for many Indians.',
    route: '/grow',
  },
  {
    id: 'tax-basics',
    order: 7,
    title: 'Know your tax basics',
    description: '80C, LTCG, and filing — keep more of what you earn.',
    route: '/learning',
    groupSlug: 'tax-basics',
  },
  {
    id: 'debt-funds',
    order: 8,
    title: 'Understand debt funds',
    description: 'Steadier than equity — useful for 1–3 year goals or FD alternatives.',
    route: '/grow',
  },
  {
    id: 'demat',
    order: 9,
    title: 'Learn about demat accounts',
    description: 'Needed for direct stocks and ETFs — not for most mutual fund SIPs.',
    route: '/learning',
    groupSlug: 'stocks',
    conceptSlug: 'demat-account',
  },
  {
    id: 'gold',
    order: 10,
    title: 'Add a gold slice',
    description: '5–10% in gold or SGBs as a portfolio hedge.',
    route: '/learning',
    groupSlug: 'gold',
  },
  {
    id: 'financial-planning',
    order: 11,
    title: 'Connect the pieces',
    description: 'Tie goals, insurance, savings, and investments into one plan.',
    route: '/learning',
    groupSlug: 'financial-planning',
  },
  {
    id: 'my-plan',
    order: 12,
    title: 'Generate your plan',
    description: 'Get a step-by-step roadmap tailored to your profile.',
    route: '/plan',
  },
];

export function getNextIncompleteStep(
  completedIds: string[]
): StartHereStep | undefined {
  return START_HERE_STEPS.find((step) => !completedIds.includes(step.id));
}

export function getPathProgress(completedIds: string[]): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = START_HERE_STEPS.length;
  const completed = completedIds.filter((id) =>
    START_HERE_STEPS.some((s) => s.id === id)
  ).length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
