'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { SectionCard, todayISO, currentQuarter } from './shared';
import type { DailyEntry, Todo, Milestone, PipelineAccount } from './Dashboard';

const BLANK_ENTRY: DailyEntry = {
  entry_date: '',
  focus: '',
  sales_count: 0,
  calls_count: 0,
  posts_count: 0,
  todos: [],
  wins: '',
};

export default function TodayView({ pipeline, milestones }: { pipeline: PipelineAccount[]; milestones: Milestone[] }) {
  const supabase = createClient();
  const today = todayISO();
  const [entry, setEntry] = useState<DailyEntry>({ ...BLANK_ENTRY, entry_date: today });
  const [loaded, setLoaded] = useState(false);

  // Load today's entry
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('entry_date', today)
        .maybeSingle();
      if (data) {
        setEntry({
          entry_date: data.entry_date,
          focus: data.focus || '',
          sales_count: data.sales_count || 0,
          calls_count: data.calls_count || 0,
          posts_count: data.posts_count || 0,
          todos: (data.todos || []) as Todo[],
          wins: data.wins || '',
        });
      }
      setLoaded(true);
    })();
  }, [supabase, today]);

  // Debounced save
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      await supabase.from('daily_entries').upsert({
        entry_date: today,
        focus: entry.focus,
        sales_count: entry.sales_count,
        calls_count: entry.calls_count,
        posts_count: entry.posts_count,
        todos: entry.todos,
        wins: entry.wins,
      }, { onConflict: 'entry_date' });
    }, 600);
    return () => clearTimeout(t);
  }, [entry, loaded, supabase, today]);

  const updateEntry = (patch: Partial<DailyEntry>) => {
    setEntry(prev => ({ ...prev, ...patch }));
  };

  const addTodo = () => {
    const newTodo: Todo = { id: Date.now().toString(), text: '', done: false };
    updateEntry({ todos: [...entry.todos, newTodo] });
  };

  const updateTodo = (id: string, patch: Partial<Todo>) => {
    updateEntry({ todos: entry.todos.map(t => t.id === id ? { ...t, ...patch } : t) });
  };

  const deleteTodo = (id: string) => {
    updateEntry({ todos: entry.todos.filter(t => t.id !== id) });
  };

  const activePipeline = pipeline.filter(p =>
    p.stage !== 'Not started' && p.stage !== 'Closed Won' && p.stage !== 'Closed Lost'
  ).length;

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        <SectionCard label="Today's Focus" accent>
          <input
            type="text"
            value={entry.focus}
            onChange={e => updateEntry({ focus: e.target.value })}
            placeholder="What's the one thing that matters most today?"
            className="w-full text-2xl font-serif italic font-light text-stone-900 bg-transparent border-0 focus:outline-none placeholder-stone-300"
            style={{ fontFamily: "'Fraunces', serif" }}
          />
        </SectionCard>

        <SectionCard label="Today's To-do">
          <div className="space-y-2">
            {entry.todos.length === 0 && (
              <div className="text-stone-400 italic text-sm py-4">No todos yet. Add the work that moves the needle today.</div>
            )}
            {entry.todos.map(t => (
              <div key={t.id} className="flex items-start gap-3 py-2 border-b border-stone-100 last:border-b-0">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={e => updateTodo(t.id, { done: e.target.checked })}
                  className="mt-1.5 w-4 h-4 accent-stone-900"
                />
                <input
                  type="text"
                  value={t.text}
                  onChange={e => updateTodo(t.id, { text: e.target.value })}
                  placeholder="Write a todo…"
                  className={`flex-1 bg-transparent border-0 focus:outline-none text-sm ${t.done ? 'line-through text-stone-400' : 'text-stone-900'}`}
                />
                <button onClick={() => deleteTodo(t.id)} className="text-stone-300 hover:text-stone-700 text-xs" title="Delete">×</button>
              </div>
            ))}
          </div>
          <button onClick={addTodo} className="mt-4 text-xs font-semibold tracking-widest uppercase text-stone-600 hover:text-stone-900">+ Add todo</button>
        </SectionCard>

        <SectionCard label="End-of-day wins / notes">
          <textarea
            value={entry.wins}
            onChange={e => updateEntry({ wins: e.target.value })}
            placeholder="What got done today? What surprised you? What needs follow-up tomorrow?"
            className="w-full bg-transparent border-0 focus:outline-none text-sm text-stone-900 placeholder-stone-300 resize-none"
            rows={4}
          />
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard label="Today's activity">
          <div className="space-y-4">
            <NumberInput label="Sales outreach DMs / emails sent" value={entry.sales_count} onChange={v => updateEntry({ sales_count: v })} />
            <NumberInput label="Discovery / sales calls taken" value={entry.calls_count} onChange={v => updateEntry({ calls_count: v })} />
            <NumberInput label="Content posts shipped" value={entry.posts_count} onChange={v => updateEntry({ posts_count: v })} />
          </div>
        </SectionCard>

        <SectionCard label="Quick context">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-600">Active pipeline</span>
              <span className="font-mono font-semibold">{activePipeline} accounts</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-600">Milestones done</span>
              <span className="font-mono font-semibold">{milestones.filter(m => m.done).length} / {milestones.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">This quarter</span>
              <span className="font-mono font-semibold">{currentQuarter()}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard label="The 3 rules" subtle>
          <ul className="text-sm text-stone-700 space-y-2 list-disc list-inside">
            <li>Sales &gt; everything until 5 PM logos signed</li>
            <li>Founder IS the sales motion until Q3</li>
            <li>NOI is the pitch, not the product</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-stone-700 flex-1">{label}</label>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(0, (value || 0) - 1))} className="w-7 h-7 border border-stone-300 hover:bg-stone-100 text-stone-700">−</button>
        <input
          type="number"
          value={value || 0}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="w-14 text-center font-mono text-sm border border-stone-300 py-1"
        />
        <button onClick={() => onChange((value || 0) + 1)} className="w-7 h-7 border border-stone-300 hover:bg-stone-100 text-stone-700">+</button>
      </div>
    </div>
  );
}
