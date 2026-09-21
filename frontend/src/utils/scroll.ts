/** Read live sticky header height set by SiteNav. */
export function getSiteHeaderOffset(extra = 20): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-height');
  const height = Number.parseFloat(raw);
  return (Number.isFinite(height) ? height : 120) + extra;
}

/** Scroll so an element sits below the sticky site header, not underneath it. */
export function scrollIntoViewBelowHeader(
  element: HTMLElement,
  options: { behavior?: ScrollBehavior; extra?: number } = {}
): void {
  const { behavior = 'smooth', extra = 20 } = options;
  const top = element.getBoundingClientRect().top + window.scrollY - getSiteHeaderOffset(extra);
  window.scrollTo({ top: Math.max(0, top), behavior });
}
