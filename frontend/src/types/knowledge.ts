export type ConceptExampleKey =
  | 'compounding'
  | 'inflation'
  | 'riskReturn'
  | 'sip'
  | 'diversification'
  | 'default';

export interface ConceptGroup {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  isPublished?: boolean;
}

export type FAQCategory = 'getting-started' | 'instruments' | 'concepts' | 'practical';

export interface Concept {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  explanation: string;
  exampleKey: ConceptExampleKey;
  groupSlug?: string;
  relatedInvestmentIds: string[];
  keywords: string[];
  sortOrder: number;
  isPublished?: boolean;
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
  explanation: string;
  highlights: string[];
  relatedConceptIds: string[];
  keywords: string[];
  sortOrder: number;
  isPublished?: boolean;
}

export interface FAQ {
  id: string;
  slug: string;
  question: string;
  category: FAQCategory;
  sortOrder: number;
  isPublished?: boolean;
}

export type TermCategory =
  | 'mutual-funds'
  | 'stocks-trading'
  | 'metrics'
  | 'market-mechanics'
  | 'tax'
  | 'debt-insurance';

export type TermTrack = 'core' | 'investor' | 'trader';

export interface Term {
  id: string;
  slug: string;
  title: string;
  shortDefinition: string;
  whyItMatters: string;
  example?: string;
  category: TermCategory;
  track: TermTrack;
  relatedConceptSlugs: string[];
  aliases: string[];
  keywords: string[];
  sortOrder: number;
}

export interface KnowledgeMeta {
  basicsIntro: { title: string; description: string };
  growIntro: { title: string; description: string };
  glossaryIntro?: { title: string; description: string };
  version: string;
}

export interface KnowledgeSnapshot {
  meta: KnowledgeMeta;
  groups: ConceptGroup[];
  concepts: Concept[];
  investments: Investment[];
  faqs: FAQ[];
  terms?: Term[];
}
