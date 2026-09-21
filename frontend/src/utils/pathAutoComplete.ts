import { START_HERE_STEPS } from './startHerePath';

/** Mark start-here steps complete when user visits matching Learning content. */
export function getStepIdsForVisit(category?: string | null, concept?: string | null): string[] {
  const ids: string[] = [];
  for (const step of START_HERE_STEPS) {
    if (concept && step.conceptSlug === concept) {
      ids.push(step.id);
      continue;
    }
    if (category && step.groupSlug === category && !step.conceptSlug) {
      ids.push(step.id);
    }
  }
  return ids;
}
