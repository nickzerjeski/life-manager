create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  goal_id uuid references public.goals(id) on delete cascade,
  name text not null,
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

--- Add a policy to allow users to manage their own projects
create policy "Users can manage their projects"
on public.projects
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);