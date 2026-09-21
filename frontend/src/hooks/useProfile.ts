import { useProfileStore } from '../store/profileStore';

export function useProfile() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  return { profile, updateProfile, completeOnboarding };
}
