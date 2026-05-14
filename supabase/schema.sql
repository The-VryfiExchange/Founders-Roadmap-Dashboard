-- ============================================================
-- Founder Dashboard — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID extension if not already on
create extension if not exists "uuid-ossp";

-- ============================================================
-- KPIs
-- ============================================================
create table if not exists public.kpis (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null,
  metric text not null,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  actual text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.kpis enable row level security;

create policy "Users access own kpis" on public.kpis
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Milestones
-- ============================================================
create table if not exists public.milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  quarter text not null,
  month text,
  title text not null,
  category text,
  done boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.milestones enable row level security;

create policy "Users access own milestones" on public.milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Pipeline (PM target accounts)
-- ============================================================
create table if not exists public.pipeline (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  units int default 0,
  ceo text,
  city text,
  stage text default 'Not started',
  warm_intro boolean default false,
  last_contact date,
  next_action text,
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pipeline enable row level security;

create policy "Users access own pipeline" on public.pipeline
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Hires
-- ============================================================
create table if not exists public.hires (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  start_month text,
  status text default 'Not started',
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.hires enable row level security;

create policy "Users access own hires" on public.hires
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Daily entries (one per day)
-- ============================================================
create table if not exists public.daily_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  entry_date date not null,
  focus text,
  sales_count int default 0,
  calls_count int default 0,
  posts_count int default 0,
  todos jsonb default '[]'::jsonb,
  wins text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table public.daily_entries enable row level security;

create policy "Users access own daily entries" on public.daily_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Weekly reviews (one per Monday)
-- ============================================================
create table if not exists public.weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  week_start date not null,
  big_bet text,
  wins jsonb default '["","",""]'::jsonb,
  blockers jsonb default '["","",""]'::jsonb,
  priorities jsonb default '["","",""]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, week_start)
);

alter table public.weekly_reviews enable row level security;

create policy "Users access own weekly reviews" on public.weekly_reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger kpis_updated before update on public.kpis
  for each row execute function public.set_updated_at();
create trigger milestones_updated before update on public.milestones
  for each row execute function public.set_updated_at();
create trigger pipeline_updated before update on public.pipeline
  for each row execute function public.set_updated_at();
create trigger hires_updated before update on public.hires
  for each row execute function public.set_updated_at();
create trigger daily_updated before update on public.daily_entries
  for each row execute function public.set_updated_at();
create trigger weekly_updated before update on public.weekly_reviews
  for each row execute function public.set_updated_at();
