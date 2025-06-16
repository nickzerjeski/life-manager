create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  start numeric,
  current numeric,
  objective numeric,
  period_from date,
  period_to date,
  status text,
  area_of_life text,
  inserted_at timestamp with time zone default now()
);
alter table public.goals enable row level security;

--- Add a policy to allow users to manage their own goals
create policy "Users can manage their goals"
on public.goals
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);