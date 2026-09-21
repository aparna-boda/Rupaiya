import type { UserProfile } from './profile';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  history: { role: MessageRole; content: string }[];
  userProfile: UserProfile;
}

export type PlanPhase = 'protect' | 'save' | 'invest' | 'tax';

export interface PlanStep {
  order: number;
  phase: PlanPhase;
  title: string;
  action: string;
  amount: number;
  instrument: string;
  conceptSlug: string;
  why: string;
}

export interface PlanResponse {
  steps: PlanStep[];
  allocationNote?: string;
}

export const PLAN_PHASE_LABELS: Record<PlanPhase, string> = {
  protect: 'Protect',
  save: 'Save',
  invest: 'Invest',
  tax: 'Optimise tax',
};

export const PLAN_PHASE_ORDER: PlanPhase[] = ['protect', 'save', 'invest', 'tax'];
