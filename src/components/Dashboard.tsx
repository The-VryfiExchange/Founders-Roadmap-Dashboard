'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import TodayView from './TodayView';
import WeekView from './WeekView';
import KPIView from './KPIView';
import MilestoneView from './MilestoneView';
import PipelineView from './PipelineView';
import HireView from './HireView';

export type KPI = {
  id: string;
  category: string;
  metric: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  actual: string;
  sort_order: number;
};

export type Milestone = {
  id: string;
  quarter: string;
  month: string;
  title: string;
  category: string;
  done: boolean;
  sort_order: number;
};

export type PipelineAccount = {
  id: string;
  name: string;
  units: number;
  ceo: string;
  city: string;
  stage: string;
  warm_intro: boolean;
  last_contact: string | null;
  next_action: string;
  sort_order: number;
};

export type Hire = {
  id: string;
  role: string;
  start_month: string;
  status: string;
  sort_order: number;
};

export type Todo = { id: string; text: string; done: boolean };

export type DailyEntry = {
  entry_date: string;
  focus: string;
  sales_count: number;
  calls_count: number;
  posts_count: number;
  todos: Todo[];
  wins: string;
};

export type WeeklyReview = {
  week_start: string;
  big_bet: string;
  wins: string[];
  blockers: string[];
  priorities: string[];
};

export default function Dashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'kpis' | 'milestones' | 'pipeline' | 'hires'>('today');
  const [loaded, setLoaded] = useState(false);

  const [kpis, setKpis] = useState<KPI[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [pipeline, setPipeline] = useState<PipelineAccount[]>([]);
  const [hires, setHires] = useState<Hire[]>([]);

  useEffect(() => {
    (async () => {
      const [k, m, p, h] = await Promise.all([
        supabase.from('kpis').select('*').order('sort_order'),
        supabase.from('milestones').select('*').order('sort_order'),
        supabase.from('pipeline').select('*').order('sort_order'),
        supabase.from('hires').select('*').order('sort_order'),
      ]);
      setKpis((k.data || []) as KPI[]);
      setMilestones((m.data || []) as Milestone[]);
      setPipeline((p.data || []) as PipelineAccount[]);
      setHires((h.data || []) as Hire[]);
      setLoaded(true);
    })();
  }, [supabase]);

  const totalMilestones = milestones.length;
  const doneMilestones = milestones.filter(m => m.done).length;
  const pct = totalMilestones > 0 ? Math.round(doneMilestones / totalMilestones * 100) : 0;

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF7' }}>
        <div className="text-stone-500 font-serif italic">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="border-b-2 border-stone-900 pb-6 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-2">
                The Exchange · Founder Dashboard
              </div>
              <h1 className="font-serif italic font-light" style={{ fontFamily: "'Fraunces', serif", fontSize: '44px', lineHeight: 1 }}>
                Where the work is.
              </h1>
            </div>
            <div className="text-right font-mono text-xs text-stone-500 leading-relaxed">
              <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>{doneMilestones} / {totalMilestones} milestones complete · {pct}%</div>
              <div className="mt-2 flex items-center gap-2 justify-end">
                <span className="inline-block bg-stone-900 text-amber-50 px-2 py-1 text-[10px] font-semibold tracking-widest uppercase">
                  Year 1 in motion
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex gap-0 border border-stone-900 mb-8">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'kpis', label: 'KPIs' },
            { id: 'milestones', label: 'Milestones' },
            { id: 'pipeline', label: 'Pipeline' },
            { id: 'hires', label: 'Hiring' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors border-r border-stone-900 last:border-r-0 ${
                activeTab === t.id
                  ? 'bg-stone-900 text-amber-50'
                  : 'bg-white text-stone-900 hover:bg-amber-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {activeTab === 'today' && <TodayView pipeline={pipeline} milestones={milestones} />}
        {activeTab === 'week' && <WeekView kpis={kpis} milestones={milestones} />}
        {activeTab === 'kpis' && <KPIView kpis={kpis} setKpis={setKpis} />}
        {activeTab === 'milestones' && <MilestoneView milestones={milestones} setMilestones={setMilestones} />}
        {activeTab === 'pipeline' && <PipelineView pipeline={pipeline} setPipeline={setPipeline} />}
        {activeTab === 'hires' && <HireView hires={hires} setHires={setHires} />}
      </div>
    </div>
  );
}
