/**
 * format.ts — Safe shared client/server formatters (no database or server-only dependencies)
 */

export function inr(paise: number): string {
  return '₹' + Math.round(paise / 100).toLocaleString('en-IN');
}

export function ago(days: number): string {
  if (days <= 0) return 'today';
  return `${days}d ago`;
}

export function hash(s: string): number {
  return [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}
