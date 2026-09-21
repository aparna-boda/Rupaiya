import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  BookOpen,
  Brain,
  Building2,
  Calculator,
  CandlestickChart,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Coins,
  FileText,
  Gem,
  Home,
  IndianRupee,
  Landmark,
  Lock,
  Map,
  MessageCircle,
  PieChart,
  Receipt,
  RotateCw,
  Shield,
  Sprout,
  Sunset,
  Target,
  TrendingUp,
} from 'lucide-react';

export type IconName =
  | 'home'
  | 'sprout'
  | 'calculator'
  | 'message'
  | 'clipboard'
  | 'book-open'
  | 'coins'
  | 'landmark'
  | 'trending-up'
  | 'pie-chart'
  | 'file-text'
  | 'candlestick'
  | 'gem'
  | 'building'
  | 'receipt'
  | 'shield'
  | 'sunset'
  | 'brain'
  | 'target'
  | 'map'
  | 'lock'
  | 'bitcoin'
  | 'rotate'
  | 'chevron-down'
  | 'chevron-up'
  | 'arrow-left'
  | 'arrow-right'
  | 'rupee';

export const ICONS: Record<IconName, LucideIcon> = {
  home: Home,
  sprout: Sprout,
  calculator: Calculator,
  message: MessageCircle,
  clipboard: ClipboardList,
  'book-open': BookOpen,
  coins: Coins,
  landmark: Landmark,
  'trending-up': TrendingUp,
  'pie-chart': PieChart,
  'file-text': FileText,
  candlestick: CandlestickChart,
  gem: Gem,
  building: Building2,
  receipt: Receipt,
  shield: Shield,
  sunset: Sunset,
  brain: Brain,
  target: Target,
  map: Map,
  lock: Lock,
  bitcoin: Bitcoin,
  rotate: RotateCw,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  rupee: IndianRupee,
};

/** Learning category slugs → icons */
export const GROUP_ICONS: Record<string, IconName> = {
  'money-fundamentals': 'coins',
  saving: 'landmark',
  'investing-basics': 'trending-up',
  'mutual-funds': 'pie-chart',
  'government-schemes': 'landmark',
  'fixed-income': 'file-text',
  stocks: 'candlestick',
  gold: 'gem',
  'real-estate': 'building',
  'tax-basics': 'receipt',
  insurance: 'shield',
  'retirement-planning': 'sunset',
  'behavioural-finance': 'brain',
  'advanced-investing': 'target',
  'financial-planning': 'map',
};

/** Investment slugs → icons (overrides DB emoji) */
export const INVESTMENT_ICONS: Record<string, IconName> = {
  savings: 'landmark',
  fd: 'lock',
  'mutual-funds': 'trending-up',
  stocks: 'building',
  gold: 'gem',
  crypto: 'bitcoin',
  ppf: 'landmark',
  'debt-funds': 'file-text',
  'term-insurance': 'shield',
  nps: 'sunset',
};

export function getGroupIcon(slug: string): IconName {
  return GROUP_ICONS[slug] ?? 'book-open';
}

export function getInvestmentIcon(slug: string): IconName {
  return INVESTMENT_ICONS[slug] ?? 'coins';
}
