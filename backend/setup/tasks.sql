create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  deadline timestamp with time zone,
  duration integer,
  priority smallint,
  dependency_ids uuid[] default '{}',
  completed_at timestamp with time zone,
  inserted_at timestamp with time zone default now()
);
alter table public.tasks enable row level security;