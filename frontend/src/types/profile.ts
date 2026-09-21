export type EmergencyFundStatus = 'none' | 'partial' | 'done';
export type ExistingInvestments = 'none' | 'epf-only' | 'mutual-funds' | 'mixed';
export type PrimaryGoal = 'retirement' | 'house' | 'child-education' | 'financial-freedom';

export interface UserProfile {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  riskAppetite: 'safe' | 'low' | 'medium' | 'high';
  emergencyFundStatus: EmergencyFundStatus;
  existingInvestments: ExistingInvestments;
  primaryGoal: PrimaryGoal;
  hasDependents: boolean;
  onboardingComplete: boolean;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 35,
  monthlyIncome: 200000,
  monthlyInvestment: 10000,
  riskAppetite: 'safe',
  emergencyFundStatus: 'none',
  existingInvestments: 'none',
  primaryGoal: 'retirement',
  hasDependents: false,
  onboardingComplete: false,
};
