'use client';

import { ReactNode } from 'react';

export function SectionCard({ label, accent, subtle, children }: { label: string; accent?: boolean; subtle?: boolean; children: ReactNode }) {
  return (
    <div className={`bg-white border ${accent ? 'border-stone-900' : 'border-stone-200'} ${subtle ? 'bg-stone-50' : ''}`}>
      {accent && <div className="h-1 bg-amber-500" />}
      <div className="px-6 py-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-b border-stone-100 pb-2 mb-3">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

export const CATEGORY_COLORS: Record<string, string> = {
  Sales: 'bg-blue-50 text-blue-900 border-blue-200',
  Revenue: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  Marketplace: 'bg-amber-50 text-amber-900 border-amber-200',
  Product: 'bg-slate-50 text-slate-900 border-slate-200',
  Marketing: 'bg-purple-50 text-purple-900 border-purple-200',
  Hiring: 'bg-rose-50 text-rose-900 border-rose-200',
  Capital: 'bg-pink-50 text-pink-900 border-pink-200',
  Ops: 'bg-gray-50 text-gray-900 border-gray-200',
  GTM: 'bg-indigo-50 text-indigo-900 border-indigo-200',
};

export const QUARTER_COLORS: Record<string, string> = {
  Q1: 'bg-amber-100',
  Q2: 'bg-blue-100',
  Q3: 'bg-emerald-100',
  Q4: 'bg-pink-100',
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function weekOfISO(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().slice(0, 10);
}

export function fmtDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function currentQuarter() {
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();
  if (y === 2026 && m >= 4 && m <= 6) return 'Q1 (May–Jul 2026)';
  if (y === 2026 && m >= 7 && m <= 9) return 'Q2 (Aug–Oct 2026)';
  if ((y === 2026 && m >= 10) || (y === 2027 && m === 0)) return 'Q3 (Nov 2026–Jan 2027)';
  if (y === 2027 && m >= 1 && m <= 3) return 'Q4 (Feb–Apr 2027)';
  if (y < 2026 || (y === 2026 && m < 4)) return 'Pre-launch';
  return 'Year 2+';
}
