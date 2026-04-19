-- Run this in Supabase SQL Editor after creating your project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  trial_ends_at timestamptz,
  current_period_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  dob date,
  age int,
  gender text,
  state text not null,
  city text,
  zip text,
  status text not null default 'new_lead',
  source text not null default 'other',
  temperature text not null default 'warm',
  assigned_agent_id uuid,
  notes_preview text,
  created_at timestamptz not null default now(),
  last_contacted_at timestamptz,
  next_followup_at timestamptz,
  underwriting jsonb,
  carrier_recommendation_id text,
  application jsonb,
  policy jsonb
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  type text not null default 'callback',
  title text not null,
  due_at timestamptz not null,
  priority text not null default 'normal',
  reason text,
  completed boolean not null default false,
  completed_at timestamptz
);

create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  timestamp timestamptz not null default now(),
  body text not null
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.leads enable row level security;
alter table public.tasks enable row level security;
alter table public.activity enable row level security;

create policy if not exists "profiles own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "subscriptions own" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "leads own" on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "tasks own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "activity own" on public.activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.handle_updated_at();
