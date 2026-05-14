-- ============================================================
-- Founder Dashboard — Supabase schema (single-user, no auth)
-- Access is gated by Vercel Password Protection at the edge.
-- Run this in Supabase Dashboard → SQL Editor → New query.
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.kpis (
  id uuid primary key default uuid_generate_v4(),
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

create table if not exists public.milestones (
  id uuid primary key default uuid_generate_v4(),
  quarter text not null,
  month text,
  title text not null,
  category text,
  done boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.pipeline (
  id uuid primary key default uuid_generate_v4(),
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

create table if not exists public.hires (
  id uuid primary key default uuid_generate_v4(),
  role text not null,
  start_month text,
  status text default 'Not started',
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.daily_entries (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null unique,
  focus text,
  sales_count int default 0,
  calls_count int default 0,
  posts_count int default 0,
  todos jsonb default '[]'::jsonb,
  wins text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  week_start date not null unique,
  big_bet text,
  wins jsonb default '["","",""]'::jsonb,
  blockers jsonb default '["","",""]'::jsonb,
  priorities jsonb default '["","",""]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
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
