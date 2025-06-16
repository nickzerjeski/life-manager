create table public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  short_description text,
  inserted_at timestamp with time zone default now()
);
alter table public.topics enable row level security;

--- Add a policy to allow users to manage their own topics
create policy "Users can manage their topics"
on public.topics
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);