import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | null, currency = 'USD'): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value?: number | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value?: number | null, multiply = false): string {
  if (value == null) return '—';
  const v = multiply ? value * 100 : value;
  return `${v.toFixed(1)}%`;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRiskColor(riskSegment?: string): string {
  switch (riskSegment) {
    case 'High': return 'text-red-400';
    case 'Medium': return 'text-yellow-400';
    case 'Low': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
}

export function getEngagementLevel(score?: number): string {
  if (!score) return 'Unknown';
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  if (score >= 30) return 'Low';
  return 'Very Low';
}
