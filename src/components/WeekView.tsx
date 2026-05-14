'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { SectionCard, weekOfISO, fmtDate, currentQuarter } from './shared';
import type { KPI, Milestone, WeeklyReview } from './Dashboard';

const BLANK_REVIEW: WeeklyReview = {
  week_start: '',
  big_bet: '',
  wins: ['', '', ''],
  blockers: ['', '', ''],
  priorities: ['', '', ''],
};

export default function WeekView({ kpis, milestones }: { kpis: KPI[]; milestones: Milestone[] }) {
  const supabase = createClient();
  const week = weekOfISO();
  const [review, setReview] = useState<WeeklyReview>({ ...BLANK_REVIEW, week_start: week });
  const [previousReviews, setPreviousReviews] = useState<WeeklyReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('weekly_reviews')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(5);
      if (data) {
        const thisWeek = data.find((r: any) => r.week_start === week);
        if (thisWeek) {
          setReview({
            week_start: thisWeek.week_start,
            big_bet: thisWeek.big_bet || '',
            wins: thisWeek.wins || ['', '', ''],
            blockers: thisWeek.blockers || ['', '', ''],
            priorities: thisWeek.priorities || ['', '', ''],
          });
        }
        setPreviousReviews(
          data.filter((r: any) => r.week_start !== week).map((r: any) => ({
            week_start: r.week_start,
            big_bet: r.big_bet || '',
            wins: r.wins || ['', '', ''],
            blockers: r.blockers || ['', '', ''],
            priorities: r.priorities || ['', '', ''],
          }))
        );
      }
      setLoaded(true);
    })();
  }, [supabase, week]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('weekly_reviews').upsert({
        user_id: user.id,
        week_start: week,
        big_bet: review.big_bet,
        wins: review.wins,
        blockers: review.blockers,
        priorities: review.priorities,
      }, { onConflict: 'user_id,week_start' });
    }, 600);
    return () => clearTimeout(t);
  }, [review, loaded, supabase, week]);

  const update = (patch: Partial<WeeklyReview>) => setReview(prev => ({ ...prev, ...patch }));
  const updateArr = (field: 'wins' | 'blockers' | 'priorities', idx: number, val: string) => {
    const arr = [...review[field]];
    arr[idx] = val;
    update({ [field]: arr });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-stone-600">
            Week of {fmtDate(week)}
          </div>
          <div className="text-xs font-mono text-stone-500">{currentQuarter()}</div>
        </div>
        <h2 className="font-serif italic text-3xl font-light mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
          Monday review.
        </h2>
      </div>

      <SectionCard label="The big bet — one thing that matters this week" accent>
        <input
          type="text"
          value={review.big_bet}
          onChange={e => update({ big_bet: e.target.value })}
          placeholder="If this is the only thing that gets done, the week is a win."
          className="w-full text-xl font-serif italic font-light text-stone-900 bg-transparent border-0 focus:outline-none placeholder-stone-300"
          style={{ fontFamily: "'Fraunces', serif" }}
        />
      </SectionCard>

      <div className="grid grid-cols-3 gap-6">
        <SectionCard label="Top 3 wins last week">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-stone-400 w-4">{i + 1}.</span>
              <input
                type="text"
                value={review.wins[i]}
                onChange={e => updateArr('wins', i, e.target.value)}
                placeholder={i === 0 ? 'Biggest win…' : ''}
                className="flex-1 bg-transparent border-b border-stone-100 focus:border-stone-900 focus:outline-none text-sm py-1"
              />
            </div>
          ))}
        </SectionCard>

        <SectionCard label="Top 3 blockers">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-stone-400 w-4">{i + 1}.</span>
              <input
                type="text"
                value={review.blockers[i]}
                onChange={e => updateArr('blockers', i, e.target.value)}
                placeholder={i === 0 ? "What's stuck?" : ''}
                className="flex-1 bg-transparent border-b border-stone-100 focus:border-stone-900 focus:outline-none text-sm py-1"
              />
            </div>
          ))}
        </SectionCard>

        <SectionCard label="Top 3 priorities this week">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-stone-400 w-4">{i + 1}.</span>
              <input
                type="text"
                value={review.priorities[i]}
                onChange={e => updateArr('priorities', i, e.target.value)}
                placeholder={i === 0 ? 'Most important…' : ''}
                className="flex-1 bg-transparent border-b border-stone-100 focus:border-stone-900 focus:outline-none text-sm py-1"
              />
            </div>
          ))}
        </SectionCard>
      </div>

      {previousReviews.length > 0 && (
        <SectionCard label="Recent weeks" subtle>
          <div className="space-y-4">
            {previousReviews.map(r => (
              <div key={r.week_start} className="border-l-2 border-stone-200 pl-4 py-1">
                <div className="text-xs font-mono text-stone-500 mb-2">Week of {fmtDate(r.week_start)}</div>
                {r.big_bet && (
                  <div className="font-serif italic text-stone-700 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                    &ldquo;{r.big_bet}&rdquo;
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 text-xs text-stone-600">
                  <div>
                    <div className="font-semibold uppercase tracking-wider text-[10px] mb-1">Wins</div>
                    {r.wins.filter(Boolean).map((w, i) => <div key={i}>· {w}</div>)}
                  </div>
                  <div>
                    <div className="font-semibold uppercase tracking-wider text-[10px] mb-1">Blockers</div>
                    {r.blockers.filter(Boolean).map((b, i) => <div key={i}>· {b}</div>)}
                  </div>
                  <div>
                    <div className="font-semibold uppercase tracking-wider text-[10px] mb-1">Priorities</div>
                    {r.priorities.filter(Boolean).map((p, i) => <div key={i}>· {p}</div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
