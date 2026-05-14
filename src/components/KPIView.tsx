'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { CATEGORY_COLORS, currentQuarter } from './shared';
import type { KPI } from './Dashboard';

export default function KPIView({ kpis, setKpis }: { kpis: KPI[]; setKpis: (k: KPI[]) => void }) {
  const supabase = createClient();
  const [saving, setSaving] = useState<string | null>(null);

  const updateActual = async (id: string, actual: string) => {
    setKpis(kpis.map(k => k.id === id ? { ...k, actual } : k));
    setSaving(id);
    await supabase.from('kpis').update({ actual }).eq('id', id);
    setSaving(null);
  };

  const categories = ['Sales', 'Revenue', 'Marketplace', 'Product', 'Marketing', 'Hiring', 'Capital'];
  const cq = currentQuarter().split(' ')[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif italic text-3xl font-light mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          KPIs.
        </h2>
        <p className="text-sm text-stone-600">Update actuals weekly. Targets are quarterly exit criteria from the operating plan.</p>
      </div>

      {categories.map(cat => {
        const rows = kpis.filter(k => k.category === cat);
        if (rows.length === 0) return null;
        return (
          <div key={cat} className="border border-stone-200 bg-white">
            <div className={`px-6 py-3 border-b border-stone-200 ${CATEGORY_COLORS[cat] || ''}`}>
              <div className="text-xs font-bold uppercase tracking-widest">{cat}</div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  <th className="text-left px-6 py-3 border-b border-stone-200">Metric</th>
                  <th className={`text-right px-3 py-3 border-b border-stone-200 ${cq === 'Q1' ? 'bg-amber-50' : ''}`}>Q1 target</th>
                  <th className={`text-right px-3 py-3 border-b border-stone-200 ${cq === 'Q2' ? 'bg-amber-50' : ''}`}>Q2 target</th>
                  <th className={`text-right px-3 py-3 border-b border-stone-200 ${cq === 'Q3' ? 'bg-amber-50' : ''}`}>Q3 target</th>
                  <th className={`text-right px-3 py-3 border-b border-stone-200 ${cq === 'Q4' ? 'bg-amber-50' : ''}`}>Q4 target</th>
                  <th className="text-right px-6 py-3 border-b border-stone-200 bg-stone-900 text-amber-50">Actual</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(k => (
                  <tr key={k.id} className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50">
                    <td className="px-6 py-3 text-sm font-medium">{k.metric}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-stone-600">{k.q1}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-stone-600">{k.q2}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-stone-600">{k.q3}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-stone-600">{k.q4}</td>
                    <td className="px-6 py-3 text-right">
                      <input
                        type="text"
                        value={k.actual}
                        onChange={e => updateActual(k.id, e.target.value)}
                        className={`w-24 text-right font-mono text-sm border px-2 py-1 focus:outline-none focus:border-stone-900 ${saving === k.id ? 'border-amber-500' : 'border-stone-300'}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
