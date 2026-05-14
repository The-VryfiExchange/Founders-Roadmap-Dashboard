'use client';

import { createClient } from '@/lib/supabase-client';
import type { Hire } from './Dashboard';

const STATUSES = ['Not started', 'Sourcing', 'Interviewing', 'Offer extended', 'Onboarding', 'Hired', 'On Hold'];

export default function HireView({ hires, setHires }: { hires: Hire[]; setHires: (h: Hire[]) => void }) {
  const supabase = createClient();

  const update = async (id: string, patch: Partial<Hire>) => {
    setHires(hires.map(h => h.id === id ? { ...h, ...patch } : h));
    await supabase.from('hires').update(patch).eq('id', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif italic text-3xl font-light mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          Hiring.
        </h2>
        <p className="text-sm text-stone-600">Year 1 hiring sequence. Don&apos;t hire ahead of need; don&apos;t let key roles slip behind.</p>
      </div>

      <div className="bg-white border border-stone-200">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <th className="text-left px-4 py-3 border-b border-stone-300">Role</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">Target Start</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {hires.map(h => (
              <tr key={h.id} className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50">
                <td className="px-4 py-3 text-sm font-medium">{h.role}</td>
                <td className="px-3 py-3 text-xs font-mono text-stone-600">{h.start_month}</td>
                <td className="px-3 py-3">
                  <select value={h.status} onChange={e => update(h.id, { status: e.target.value })} className="text-xs border border-stone-300 px-2 py-1 focus:outline-none focus:border-stone-900">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
