import type { IconName } from '../utils/icons';
import type {
  EmergencyFundStatus,
  ExistingInvestments,
  PrimaryGoal,
} from '../types/profile';

export const APP_NAME = 'Rupaiya';
export const APP_TAGLINE = 'How does a rupee earn another rupee?';

export const DISCLAIMER =
  'Projections are illustrative, based on historical averages. Not SEBI-registered investment advice. Past returns do not guarantee future results.';

export const WHAT_WE_DONT_DO = [
  'Sell or recommend specific products for commission',
  'Execute trades or link to your brokerage account',
  'Provide live market prices or portfolio tracking',
  'Replace a qualified CA, financial planner, or SEBI-registered adviser',
  'Guarantee returns or predict market movements',
];

export const ONBOARDING_STEPS = [
  {
    title: 'What should we call you?',
    subtext: 'First name is enough — this is your personal space.',
    field: 'name' as const,
    prefix: '',
    inputType: 'text' as const,
    placeholder: 'Aparna',
  },
  {
    title: 'How old are you?',
    subtext: 'This helps us show projections for YOUR timeline.',
    field: 'age' as const,
    prefix: '',
    inputType: 'number' as const,
    placeholder: '35',
  },
  {
    title: 'What do you earn monthly?',
    subtext: "Rough number is fine. We don't store this anywhere.",
    field: 'monthlyIncome' as const,
    prefix: '₹',
    inputType: 'number' as const,
    placeholder: '0',
  },
  {
    title: 'How much can you set aside?',
    subtext: 'Even ₹500 is a start. You can change this anytime.',
    field: 'monthlyInvestment' as const,
    prefix: '₹',
    inputType: 'number' as const,
    placeholder: '0',
  },
];

export const NAV_ITEMS: { label: string; path: string; icon: IconName }[] = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Grow Money', path: '/grow', icon: 'sprout' },
  { label: 'Learning', path: '/learning', icon: 'book-open' },
  { label: 'Calculator', path: '/calculate', icon: 'calculator' },
  { label: 'Ask', path: '/ask', icon: 'message' },
  { label: 'My Plan', path: '/plan', icon: 'clipboard' },
];

export const EMERGENCY_FUND_OPTIONS: { value: EmergencyFundStatus; label: string; hint: string }[] = [
  { value: 'none', label: 'Not started', hint: 'No dedicated emergency fund yet' },
  { value: 'partial', label: 'Partially built', hint: 'Some savings, not 6 months yet' },
  { value: 'done', label: 'Done', hint: '6+ months of expenses set aside' },
];

export const EXISTING_INVESTMENTS_OPTIONS: {
  value: ExistingInvestments;
  label: string;
  hint: string;
}[] = [
  { value: 'none', label: 'Starting fresh', hint: 'No investments yet' },
  { value: 'epf-only', label: 'EPF only', hint: 'Employer provident fund via salary' },
  { value: 'mutual-funds', label: 'Some mutual funds', hint: 'SIP or lump-sum in MFs' },
  { value: 'mixed', label: 'Mixed', hint: 'Stocks, FDs, gold, or other mix' },
];

export const PRIMARY_GOAL_OPTIONS: { value: PrimaryGoal; label: string; hint: string }[] = [
  { value: 'retirement', label: 'Retirement', hint: 'Build a corpus for age 60+' },
  { value: 'house', label: 'Buy a home', hint: 'Down payment or full purchase' },
  { value: 'child-education', label: "Child's education", hint: 'School, college, or abroad' },
  { value: 'financial-freedom', label: 'Financial freedom', hint: 'Work optional, life on your terms' },
];

export const HOME_NAV_CARDS: {
  label: string;
  path: string;
  icon: IconName;
  description: string;
}[] = [
  { label: 'Grow Money', path: '/grow', icon: 'sprout', description: 'Ways to grow your money' },
  { label: 'Calculator', path: '/calculate', icon: 'calculator', description: 'Project your wealth' },
  { label: 'Learning', path: '/learning', icon: 'book-open', description: 'Core money concepts' },
  { label: 'My Plan', path: '/plan', icon: 'clipboard', description: 'Your personalised plan' },
];
