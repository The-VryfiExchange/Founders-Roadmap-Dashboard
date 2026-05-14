'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { PipelineAccount } from './Dashboard';

const STAGES = ['Not started', 'Researching', 'Outreach sent', 'Discovery', 'Pilot proposed', 'Pilot active', 'Negotiating', 'Closed Won', 'Closed Lost'];

export default function PipelineView({ pipeline, setPipeline }: { pipeline: PipelineAccount[]; setPipeline: (p: PipelineAccount[]) => void }) {
  const supabase = createClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '', units: 0, ceo: '', city: '', stage: 'Not started', warm_intro: false, last_contact: '', next_action: '',
  });

  const update = async (id: string, patch: Partial<PipelineAccount>) => {
    setPipeline(pipeline.map(p => p.id === id ? { ...p, ...patch } : p));
    const dbPatch: any = { ...patch };
    if (dbPatch.last_contact === '') dbPatch.last_contact = null;
    await supabase.from('pipeline').update(dbPatch).eq('id', id);
  };

  const deleteAccount = async (id: string) => {
    setPipeline(pipeline.filter(p => p.id !== id));
    await supabase.from('pipeline').delete().eq('id', id);
  };

  const addAccount = async () => {
    if (!newAccount.name.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const maxSort = Math.max(0, ...pipeline.map(p => p.sort_order || 0));
    const { data } = await supabase
      .from('pipeline')
      .insert({
        user_id: user.id,
        name: newAccount.name,
        units: newAccount.units || 0,
        ceo: newAccount.ceo,
        city: newAccount.city,
        stage: newAccount.stage,
        warm_intro: newAccount.warm_intro,
        last_contact: newAccount.last_contact || null,
        next_action: newAccount.next_action,
        sort_order: maxSort + 1,
      })
      .select()
      .single();

    if (data) {
      setPipeline([...pipeline, data as PipelineAccount]);
      setNewAccount({ name: '', units: 0, ceo: '', city: '', stage: 'Not started', warm_intro: false, last_contact: '', next_action: '' });
      setShowAddForm(false);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    STAGES.forEach(s => c[s] = pipeline.filter(p => p.stage === s).length);
    return c;
  }, [pipeline]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif italic text-3xl font-light mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Pipeline.
          </h2>
          <p className="text-sm text-stone-600">Priority 10 + Tier A targets. Update stage and next action weekly.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs font-semibold tracking-widest uppercase bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700">
          + Add account
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {['Researching', 'Outreach sent', 'Discovery', 'Pilot active', 'Closed Won'].map(s => (
          <div key={s} className="border border-stone-200 bg-white px-3 py-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">{s}</div>
            <div className="font-serif text-2xl font-light" style={{ fontFamily: "'Fraunces', serif" }}>{counts[s] || 0}</div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="border border-stone-900 bg-amber-50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="Company name" className="border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-stone-900" />
            <input type="number" value={newAccount.units} onChange={e => setNewAccount({ ...newAccount, units: parseInt(e.target.value) || 0 })} placeholder="Units" className="border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-stone-900" />
            <input type="text" value={newAccount.ceo} onChange={e => setNewAccount({ ...newAccount, ceo: e.target.value })} placeholder="CEO / decision maker" className="border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-stone-900" />
            <input type="text" value={newAccount.city} onChange={e => setNewAccount({ ...newAccount, city: e.target.value })} placeholder="HQ city, state" className="border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-stone-900" />
          </div>
          <div className="flex gap-2">
            <button onClick={addAccount} className="text-xs font-semibold tracking-widest uppercase bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700">Save</button>
            <button onClick={() => setShowAddForm(false)} className="text-xs font-semibold tracking-widest uppercase border border-stone-900 px-4 py-2 hover:bg-stone-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <th className="text-left px-4 py-3 border-b border-stone-300">Account</th>
              <th className="text-right px-3 py-3 border-b border-stone-300">Units</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">CEO</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">Stage</th>
              <th className="text-center px-3 py-3 border-b border-stone-300">Warm</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">Last contact</th>
              <th className="text-left px-3 py-3 border-b border-stone-300">Next action</th>
              <th className="w-8 border-b border-stone-300"></th>
            </tr>
          </thead>
          <tbody>
            {pipeline.map(p => (
              <tr key={p.id} className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-[10px] font-mono text-stone-500">{p.city}</div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-xs">{p.units?.toLocaleString() || 0}</td>
                <td className="px-3 py-2.5 text-xs text-stone-700">{p.ceo}</td>
                <td className="px-3 py-2.5">
                  <select value={p.stage} onChange={e => update(p.id, { stage: e.target.value })} className="text-xs border border-stone-300 px-2 py-1 focus:outline-none focus:border-stone-900">
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <input type="checkbox" checked={p.warm_intro} onChange={e => update(p.id, { warm_intro: e.target.checked })} className="w-4 h-4 accent-stone-900" />
                </td>
                <td className="px-3 py-2.5">
                  <input type="date" value={p.last_contact || ''} onChange={e => update(p.id, { last_contact: e.target.value || null })} className="text-xs border border-stone-200 px-2 py-1 focus:outline-none focus:border-stone-900" />
                </td>
                <td className="px-3 py-2.5">
                  <input type="text" value={p.next_action || ''} onChange={e => update(p.id, { next_action: e.target.value })} className="w-full text-xs border border-stone-200 px-2 py-1 focus:outline-none focus:border-stone-900" />
                </td>
                <td className="px-2 py-2.5 text-center">
                  <button onClick={() => deleteAccount(p.id)} className="text-stone-300 hover:text-rose-600 text-xs" title="Delete">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
