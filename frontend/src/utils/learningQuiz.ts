import type { EmergencyFundStatus, PrimaryGoal, UserProfile } from '../types/profile';

export interface QuizAnswers {
  emergencyFund: EmergencyFundStatus;
  riskAppetite: UserProfile['riskAppetite'];
  primaryGoal: PrimaryGoal;
}

export interface QuizRecommendation {
  title: string;
  description: string;
  route: string;
  profileUpdates: Partial<UserProfile>;
}

export function recommendFromQuiz(answers: QuizAnswers): QuizRecommendation {
  const profileUpdates: Partial<UserProfile> = {
    emergencyFundStatus: answers.emergencyFund,
    riskAppetite: answers.riskAppetite,
    primaryGoal: answers.primaryGoal,
  };

  if (answers.emergencyFund === 'none') {
    return {
      title: 'Start with your emergency fund',
      description:
        'Before any SIP or stock, build 6 months of expenses in a safe, liquid place. Head to Saving concepts first.',
      route: '/learning?category=saving&concept=emergency-fund',
      profileUpdates,
    };
  }

  if (answers.riskAppetite === 'safe' || answers.riskAppetite === 'low') {
    return {
      title: 'Safe path: protect, then PPF & debt',
      description:
        'Your answers point to FDs, PPF, debt funds, and term insurance before equity. Grow Money has the right instruments.',
      route: '/grow',
      profileUpdates,
    };
  }

  if (answers.primaryGoal === 'retirement') {
    return {
      title: 'Retirement focus: SIP + NPS',
      description:
        'Index SIP for growth, NPS for extra 80CCD(1B) benefit. Learning path will prioritise mutual funds and retirement.',
      route: '/learning?category=retirement-planning',
      profileUpdates,
    };
  }

  return {
    title: 'Balanced path: SIP habit first',
    description:
      'Build a monthly SIP habit, keep an emergency fund topped up, and use Ask Anything for specific doubts.',
    route: '/home',
    profileUpdates,
  };
}
