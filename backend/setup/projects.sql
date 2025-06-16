create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  goal_id uuid references public.goals(id) on delete cascade,
  name text not null,
  short_description text,
  description text,
  start numeric,
  current numeric,
  objective numeric,
  period_from date,
  period_to date,
  contribution_pct numeric,
  status text,
  inserted_at timestamp with time zone default now()
);
alter table public.projects enable row level security;