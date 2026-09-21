import { create } from 'zustand';
import { DEFAULT_PROFILE, type UserProfile } from '../types/profile';

const STORAGE_KEY = 'rupaiya_profile';

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserProfile>;
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        name: parsed.name ?? '',
        emergencyFundStatus: parsed.emergencyFundStatus ?? DEFAULT_PROFILE.emergencyFundStatus,
        existingInvestments: parsed.existingInvestments ?? DEFAULT_PROFILE.existingInvestments,
        primaryGoal: parsed.primaryGoal ?? DEFAULT_PROFILE.primaryGoal,
        hasDependents: parsed.hasDependents ?? DEFAULT_PROFILE.hasDependents,
      };
    }
  } catch {
    // fall through to default
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

interface ProfileState {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  completeOnboarding: (data: Omit<UserProfile, 'onboardingComplete'>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: loadProfile(),
  setProfile: (profile) => {
    saveProfile(profile);
    set({ profile });
  },
  updateProfile: (partial) =>
    set((state) => {
      const profile = { ...state.profile, ...partial };
      saveProfile(profile);
      return { profile };
    }),
  completeOnboarding: (data) =>
    set(() => {
      const profile: UserProfile = {
        ...data,
        onboardingComplete: true,
      };
      saveProfile(profile);
      return { profile };
    }),
}));
