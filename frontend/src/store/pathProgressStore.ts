import { create } from 'zustand';
import { START_HERE_STEPS } from '../utils/startHerePath';

const STORAGE_KEY = 'rupaiya_path_progress';

function loadCompleted(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      return parsed.filter((id) => START_HERE_STEPS.some((s) => s.id === id));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveCompleted(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface PathProgressState {
  completedStepIds: string[];
  isStepComplete: (stepId: string) => boolean;
  toggleStep: (stepId: string) => void;
  markStepComplete: (stepId: string) => void;
}

export const usePathProgressStore = create<PathProgressState>((set, get) => ({
  completedStepIds: loadCompleted(),
  isStepComplete: (stepId) => get().completedStepIds.includes(stepId),
  toggleStep: (stepId) =>
    set((state) => {
      const completed = state.completedStepIds.includes(stepId)
        ? state.completedStepIds.filter((id) => id !== stepId)
        : [...state.completedStepIds, stepId];
      saveCompleted(completed);
      return { completedStepIds: completed };
    }),
  markStepComplete: (stepId) =>
    set((state) => {
      if (state.completedStepIds.includes(stepId)) return state;
      const completed = [...state.completedStepIds, stepId];
      saveCompleted(completed);
      return { completedStepIds: completed };
    }),
}));
