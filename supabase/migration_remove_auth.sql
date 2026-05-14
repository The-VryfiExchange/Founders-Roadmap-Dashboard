-- ============================================================
-- Migration: remove Supabase auth dependency from the dashboard.
-- Run this once in Supabase Dashboard → SQL Editor → New query.
-- After this, every public.* table is open via the anon key.
-- Protect the site with Vercel Password Protection.
-- ============================================================

-- 1) Drop RLS policies (if they exist from the original schema)
drop policy if exists "Users access own kpis"           on public.kpis;
drop policy if exists "Users access own milestones"     on public.milestones;
drop policy if exists "Users access own pipeline"       on public.pipeline;
drop policy if exists "Users access own hires"          on public.hires;
drop policy if exists "Users access own daily entries"  on public.daily_entries;
drop policy if exists "Users access own weekly reviews" on public.weekly_reviews;

-- 2) Disable RLS so the anon key can read/write
alter table public.kpis            disable row level security;
alter table public.milestones      disable row level security;
alter table public.pipeline        disable row level security;
alter table public.hires           disable row level security;
alter table public.daily_entries   disable row level security;
alter table public.weekly_reviews  disable row level security;

-- 3) Drop user_id columns (these reference auth.users)
alter table public.kpis            drop column if exists user_id;
alter table public.milestones      drop column if exists user_id;
alter table public.pipeline        drop column if exists user_id;
alter table public.hires           drop column if exists user_id;
alter table public.daily_entries   drop column if exists user_id;
alter table public.weekly_reviews  drop column if exists user_id;

-- 4) Replace composite unique constraints with single-column ones
alter table public.daily_entries
  drop constraint if exists daily_entries_user_id_entry_date_key;
alter table public.daily_entries
  add constraint daily_entries_entry_date_key unique (entry_date);

alter table public.weekly_reviews
  drop constraint if exists weekly_reviews_user_id_week_start_key;
alter table public.weekly_reviews
  add constraint weekly_reviews_week_start_key unique (week_start);
