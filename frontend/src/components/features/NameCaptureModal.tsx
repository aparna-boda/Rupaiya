import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import Button from '../ui/Button';
import Input from '../ui/Input';

/** Shown when onboarding is done but the user's name was never saved. */
export default function NameCaptureModal() {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const needsName = profile.onboardingComplete && !profile.name.trim() && !saved;

  if (!needsName) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    updateProfile({ name: trimmed });
    setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-capture-title"
    >
      <div className="w-full max-w-md bg-bg rounded-xl border border-border shadow-xl p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
          Personalise Rupaiya
        </p>
        <h2 id="name-capture-title" className="text-xl font-medium text-ink mb-1">
          What should we call you?
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          Your first name is enough. We use it in greetings, your plan, and chat — this stays on
          your device only.
        </p>
        <Input
          label=""
          placeholder="Aparna"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
        />
        <Button fullWidth onClick={handleSave} disabled={name.trim().length < 2} className="mt-6">
          Save and continue
        </Button>
      </div>
    </div>
  );
}
