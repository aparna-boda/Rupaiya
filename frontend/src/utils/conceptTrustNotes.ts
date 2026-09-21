/** Regulatory / tax footnotes shown on concept cards — Tier 3 trust layer. */

const SLUG_NOTES: Record<string, string> = {
  'income-tax-slabs': 'As of FY 2025-26 — verify slabs on incometax.gov.in before filing.',
  'section-80c': '₹1.5L limit and eligible instruments change — confirm on incometax.gov.in.',
  'section-80ccd': '80CCD(1B) ₹50k limit — check current NPS rules on nsdl.com or incometax.gov.in.',
  'ltcg-stcg': 'Equity LTCG/STCG rates have changed in recent budgets — verify before selling.',
  'tds-on-investments': 'TDS thresholds and rates update periodically — check your Form 26AS.',
  'tax-loss-harvesting': 'Wash-sale and offset rules need care — a CA helps for large portfolios.',
  ppf: 'PPF rate is set quarterly by the government — check current rate before planning.',
  nps: 'NPS tiers, charges, and tax rules evolve — read PFRDA guidelines before investing.',
  epf: 'EPF rules apply to salaried employees — balance and interest via EPFO portal.',
  'term-insurance': 'IRDAI-regulated product — compare claim settlement ratios, not just premium.',
  'health-insurance': 'IRDAI-regulated — read exclusions, waiting periods, and room-rent limits.',
  sebi: 'SEBI rules protect investors — always use SEBI-registered brokers and AMFI-registered distributors.',
};

const GROUP_NOTES: Record<string, string> = {
  'tax-basics': 'Tax rules change with each budget — confirm on incometax.gov.in before acting.',
  'government-schemes': 'Rates and limits update periodically — verify on official government portals.',
  insurance: 'Insurance is IRDAI-regulated — never buy purely for tax saving.',
};

export function getConceptTrustNote(slug: string, groupSlug?: string): string | null {
  if (SLUG_NOTES[slug]) return SLUG_NOTES[slug];
  if (groupSlug && GROUP_NOTES[groupSlug]) return GROUP_NOTES[groupSlug];
  return null;
}
