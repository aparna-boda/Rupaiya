export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatAge(currentAge: number, years: number): number {
  return currentAge + years;
}

export function formatMultiplier(value: number, invested: number): string {
  return `${(value / invested).toFixed(1)}×`;
}

export function getFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/)[0];
}
