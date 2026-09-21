export interface ConceptAction {
  doThisNext: string;
  investmentSlug?: string;
  askPrompt?: string;
}

const CONCEPT_ACTIONS: Record<string, ConceptAction> = {
  inflation: {
    doThisNext: 'Check if your savings account rate beats inflation — if not, plan your first investment.',
    askPrompt: 'How does inflation affect my savings at current rates?',
  },
  'emergency-fund': {
    doThisNext: 'Calculate 6 months of expenses and park that in a separate savings or liquid fund account.',
    investmentSlug: 'savings',
    askPrompt: 'How much emergency fund do I need on my income?',
  },
  'term-insurance': {
    doThisNext: 'Get a term plan quote for 10–15× your annual income — skip ULIPs and endowment plans.',
    investmentSlug: 'term-insurance',
    askPrompt: 'How much term insurance cover do I need?',
  },
  sip: {
    doThisNext: 'Pick one index fund or debt fund and set up a ₹500+ monthly auto-debit SIP.',
    investmentSlug: 'mutual-funds',
    askPrompt: 'Which SIP should I start with for a beginner?',
  },
  compounding: {
    doThisNext: 'Use the Calculator to see what 10 years of SIP could become — then start one.',
    askPrompt: 'Show me compounding with my monthly investment amount.',
  },
  ppf: {
    doThisNext: 'Open a PPF account at your bank or post office and commit ₹500/month minimum.',
    investmentSlug: 'ppf',
    askPrompt: 'Is PPF right for me given my tax slab and goals?',
  },
  'debt-mutual-funds': {
    doThisNext: 'Compare a liquid fund vs your savings account for emergency money.',
    investmentSlug: 'debt-funds',
    askPrompt: 'When should I use a debt fund instead of an FD?',
  },
  'demat-account': {
    doThisNext: 'Only open a demat if you plan direct stocks or ETFs — mutual fund SIPs often skip this.',
    investmentSlug: 'stocks',
    askPrompt: 'Do I need a demat account if I only do mutual fund SIPs?',
  },
  nps: {
    doThisNext: 'Check if you have room under 80CCD(1B) for an extra ₹50k tax deduction.',
    investmentSlug: 'nps',
    askPrompt: 'Should I add NPS on top of my PPF and SIP?',
  },
  diversification: {
    doThisNext: 'Split your monthly amount across 2–3 asset types instead of one bet.',
    askPrompt: 'How should I diversify with my monthly investment?',
  },
  'tax-saving': {
    doThisNext: 'List your 80C options — PPF, ELSS, EPF — and pick before March if salaried.',
    askPrompt: 'What are the best 80C options for my profile?',
  },
};

const GROUP_FALLBACKS: Record<string, ConceptAction> = {
  saving: {
    doThisNext: 'Move one month of expenses to a separate account this week.',
    investmentSlug: 'savings',
  },
  insurance: {
    doThisNext: 'List who depends on your income — then check if term cover matches.',
    investmentSlug: 'term-insurance',
  },
  'mutual-funds': {
    doThisNext: 'Start or review one SIP — consistency beats timing.',
    investmentSlug: 'mutual-funds',
  },
  'government-schemes': {
    doThisNext: 'See if PPF or NPS fits your long-term tax plan.',
    investmentSlug: 'ppf',
  },
  stocks: {
    doThisNext: 'Only add direct stocks after an emergency fund and core SIP are running.',
    investmentSlug: 'stocks',
  },
};

export function getConceptAction(slug: string, groupSlug?: string): ConceptAction {
  if (CONCEPT_ACTIONS[slug]) return CONCEPT_ACTIONS[slug];
  if (groupSlug && GROUP_FALLBACKS[groupSlug]) return GROUP_FALLBACKS[groupSlug];
  return {
    doThisNext: 'Ask a follow-up question to connect this concept to your numbers.',
    askPrompt: `How does ${slug.replace(/-/g, ' ')} apply to my situation?`,
  };
}
