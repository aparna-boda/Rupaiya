import { useEffect, useRef, useState } from 'react';
import {
  EMERGENCY_FUND_OPTIONS,
  EXISTING_INVESTMENTS_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '../../constants/copy';
import { useProfile } from '../../hooks/useProfile';
import { formatINRFull, getFirstName } from '../../utils/formatters';
import { RISK_LABELS } from '../../utils/learningPath';
import type { UserProfile } from '../../types/profile';
import Button from '../ui/Button';
import Input from '../ui/Input';

const RISK_OPTIONS: UserProfile['riskAppetite'][] = ['safe', 'low', 'medium', 'high'];

type ProfileDraft = {
  name: string;
  age: string;
  monthlyIncome: string;
  monthlyInvestment: string;
  riskAppetite: UserProfile['riskAppetite'];
  emergencyFundStatus: UserProfile['emergencyFundStatus'];
  existingInvestments: UserProfile['existingInvestments'];
  primaryGoal: UserProfile['primaryGoal'];
  hasDependents: boolean;
};

function draftFromProfile(profile: UserProfile): ProfileDraft {
  return {
    name: profile.name,
    age: String(profile.age),
    monthlyIncome: String(profile.monthlyIncome),
    monthlyInvestment: String(profile.monthlyInvestment),
    riskAppetite: profile.riskAppetite,
    emergencyFundStatus: profile.emergencyFundStatus,
    existingInvestments: profile.existingInvestments,
    primaryGoal: profile.primaryGoal,
    hasDependents: profile.hasDependents,
  };
}

export default function ProfileMenu() {
  const { profile, updateProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(() => draftFromProfile(profile));
  const panelRef = useRef<HTMLDivElement>(null);
  const firstName = getFirstName(profile.name);

  useEffect(() => {
    if (open) setDraft(draftFromProfile(profile));
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const handleSave = () => {
    const trimmedName = draft.name.trim();
    const age = Number(draft.age);
    const monthlyIncome = Number(draft.monthlyIncome);
    const monthlyInvestment = Number(draft.monthlyInvestment);
    if (trimmedName.length < 2 || age < 18 || monthlyIncome < 1000 || monthlyInvestment < 500) {
      return;
    }
    updateProfile({
      name: trimmedName,
      age,
      monthlyIncome,
      monthlyInvestment,
      riskAppetite: draft.riskAppetite,
      emergencyFundStatus: draft.emergencyFundStatus,
      existingInvestments: draft.existingInvestments,
      primaryGoal: draft.primaryGoal,
      hasDependents: draft.hasDependents,
    });
    setOpen(false);
  };

  const isValid =
    draft.name.trim().length >= 2 &&
    Number(draft.age) >= 18 &&
    Number(draft.monthlyIncome) >= 1000 &&
    Number(draft.monthlyInvestment) >= 500;

  return (
    <div className="relative shrink-0 ml-auto" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-card rounded-full border border-border hover:border-[var(--color-hover-border)] hover:bg-[var(--color-hover-bg)] transition-colors"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={firstName ? `${firstName}'s profile` : 'Add your name'}
      >
        <span
          className="w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center shrink-0"
          aria-hidden
        >
          {firstName ? firstName.charAt(0).toUpperCase() : '?'}
        </span>
        <span className="text-sm leading-none truncate max-w-[8rem] sm:max-w-[10rem]">
          {firstName ? (
            <>
              <span className="text-muted font-normal">Hi, </span>
              <span className="font-semibold font-brand text-primary-dark">{firstName}</span>
            </>
          ) : (
            <span className="font-medium text-primary-dark">Add your name</span>
          )}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[min(100vw-3rem,22rem)] max-h-[80vh] overflow-y-auto bg-bg border border-border rounded-xl shadow-lg p-5 z-50"
          role="dialog"
          aria-label="Your profile"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
            Your profile
          </p>

          <div className="space-y-4">
            <Input
              label="Your name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Aparna"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                type="number"
                inputMode="numeric"
                value={draft.age}
                onChange={(e) => setDraft((d) => ({ ...d, age: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Risk appetite</label>
                <select
                  value={draft.riskAppetite}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      riskAppetite: e.target.value as UserProfile['riskAppetite'],
                    }))
                  }
                  className="w-full bg-sunken border border-border rounded-md py-3 px-3 text-sm text-ink focus:outline-none focus:border-primary"
                >
                  {RISK_OPTIONS.map((risk) => (
                    <option key={risk} value={risk}>
                      {RISK_LABELS[risk]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Monthly income"
              prefix="₹"
              type="number"
              inputMode="numeric"
              value={draft.monthlyIncome}
              onChange={(e) => setDraft((d) => ({ ...d, monthlyIncome: e.target.value }))}
            />
            <Input
              label="Monthly investment"
              prefix="₹"
              type="number"
              inputMode="numeric"
              value={draft.monthlyInvestment}
              onChange={(e) => setDraft((d) => ({ ...d, monthlyInvestment: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Emergency fund</label>
              <select
                value={draft.emergencyFundStatus}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    emergencyFundStatus: e.target.value as UserProfile['emergencyFundStatus'],
                  }))
                }
                className="w-full bg-sunken border border-border rounded-md py-3 px-3 text-sm text-ink focus:outline-none focus:border-primary"
              >
                {EMERGENCY_FUND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Existing investments</label>
              <select
                value={draft.existingInvestments}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    existingInvestments: e.target.value as UserProfile['existingInvestments'],
                  }))
                }
                className="w-full bg-sunken border border-border rounded-md py-3 px-3 text-sm text-ink focus:outline-none focus:border-primary"
              >
                {EXISTING_INVESTMENTS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Primary goal</label>
              <select
                value={draft.primaryGoal}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    primaryGoal: e.target.value as UserProfile['primaryGoal'],
                  }))
                }
                className="w-full bg-sunken border border-border rounded-md py-3 px-3 text-sm text-ink focus:outline-none focus:border-primary"
              >
                {PRIMARY_GOAL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Dependents</label>
              <select
                value={draft.hasDependents ? 'yes' : 'no'}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, hasDependents: e.target.value === 'yes' }))
                }
                className="w-full bg-sunken border border-border rounded-md py-3 px-3 text-sm text-ink focus:outline-none focus:border-primary"
              >
                <option value="no">No</option>
                <option value="yes">Yes — spouse, parents, or kids</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-muted mt-4 leading-relaxed">
            Stored on this device only — {formatINRFull(profile.monthlyInvestment)}/month drives
            your projections and AI answers.
          </p>

          <div className="flex gap-2 mt-5">
            <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
