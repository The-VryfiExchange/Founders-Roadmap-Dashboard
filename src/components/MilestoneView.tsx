'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { CATEGORY_COLORS, QUARTER_COLORS } from './shared';
import type { Milestone } from './Dashboard';

export default function MilestoneView({ milestones, setMilestones }: { milestones: Milestone[]; setMilestones: (m: Milestone[]) => void }) {
  const supabase = createClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ quarter: 'Q1', month: '', title: '', category: 'Sales' });

  const toggle = async (id: string) => {
    const m = milestones.find(x => x.id === id);
    if (!m) return;
    const newDone = !m.done;
    setMilestones(milestones.map(x => x.id === id ? { ...x, done: newDone } : x));
    await supabase.from('milestones').update({ done: newDone }).eq('id', id);
  };

  const deleteMilestone = async (id: string) => {
    setMilestones(milestones.filter(x => x.id !== id));
    await supabase.from('milestones').delete().eq('id', id);
  };

  const addMilestone = async () => {
    if (!newMilestone.title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const maxSort = Math.max(0, ...milestones.map(m => m.sort_order || 0));
    const { data } = await supabase
      .from('milestones')
      .insert({
        user_id: user.id,
        quarter: newMilestone.quarter,
        month: newMilestone.month,
        title: newMilestone.title,
        category: newMilestone.category,
        done: false,
        sort_order: maxSort + 1,
      })
      .select()
      .single();

    if (data) {
      setMilestones([...milestones, data as Milestone]);
      setNewMilestone({ quarter: 'Q1', month: '', title: '', category: 'Sales' });
      setShowAddForm(false);
    }
  };

  const grouped = ['Q1', 'Q2', 'Q3', 'Q4'].map(q => ({
    quarter: q,
    items: milestones.filter(m => m.quarter === q),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif italic text-3xl font-light mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Milestones.
          </h2>
          <p className="text-sm text-stone-600">
            The things that have to happen for Year 1 to be a win.
            {' '}
            <span className="font-semibold">{milestones.filter(m => m.done).length} of {milestones.length} complete.</span>
          </p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs font-semibold tracking-widest uppercase bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700">
          + Add milestone
        </button>
      </div>

      {showAddForm && (
        <div className="border border-stone-900 bg-amber-50 p-4 space-y-3">
          <input
            type="text"
            value={newMilestone.title}
            onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="Milestone title…"
            className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-900"
          />
          <div className="grid grid-cols-3 gap-3">
            <select value={newMilestone.quarter} onChange={e => setNewMilestone({ ...newMilestone, quarter: e.target.value })} className="border border-stone-300 px-2 py-2 text-sm focus:outline-none">
              <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
            </select>
            <input
              type="text"
              value={newMilestone.month}
              onChange={e => setNewMilestone({ ...newMilestone, month: e.target.value })}
              placeholder="Month (e.g., Aug 2026)"
              className="border border-stone-300 px-2 py-2 text-sm focus:outline-none"
            />
            <select value={newMilestone.category} onChange={e => setNewMilestone({ ...newMilestone, category: e.target.value })} className="border border-stone-300 px-2 py-2 text-sm focus:outline-none">
              <option>Sales</option><option>GTM</option><option>Product</option><option>Hiring</option><option>Capital</option><option>Ops</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addMilestone} className="text-xs font-semibold tracking-widest uppercase bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700">Save</button>
            <button onClick={() => setShowAddForm(false)} className="text-xs font-semibold tracking-widest uppercase border border-stone-900 px-4 py-2 hover:bg-stone-100">Cancel</button>
          </div>
        </div>
      )}

      {grouped.map(g => (
        <div key={g.quarter}>
          <div className={`px-4 py-2 ${QUARTER_COLORS[g.quarter]} border border-stone-300 mb-2`}>
            <div className="text-xs font-bold uppercase tracking-widest">
              {g.quarter} · {g.items.filter(i => i.done).length} / {g.items.length} complete
            </div>
          </div>
          <div className="bg-white border border-stone-200">
            {g.items.map((m, idx) => (
              <div key={m.id} className={`flex items-start gap-4 px-4 py-3 ${idx < g.items.length - 1 ? 'border-b border-stone-100' : ''} hover:bg-stone-50`}>
                <input type="checkbox" checked={m.done} onChange={() => toggle(m.id)} className="mt-1 w-4 h-4 accent-stone-900 flex-shrink-0" />
                <div className="flex-1">
                  <div className={`text-sm ${m.done ? 'line-through text-stone-400' : 'text-stone-900'}`}>{m.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[10px] text-stone-500">{m.month}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border ${CATEGORY_COLORS[m.category] || ''}`}>{m.category}</span>
                  </div>
                </div>
                <button onClick={() => deleteMilestone(m.id)} className="text-stone-300 hover:text-rose-600 text-xs" title="Delete">×</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
