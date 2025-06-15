# Info
For this project, [Supabase](https://supabase.com/) is used as backend.
# Preliminaries
Have Supabased setup with Docker and add the n8n container to the docker network
# Setup
1. Create a domain and map http requests to that domain to `localhost:8000`. That is the supabase container.
2. Go to that domain and log in with the credentials provided in the `.env` file.
3. Run the n8n RAG Agent to setup databases
4. Add the following policies to let users modify their files:
```
-- Rule for reading and inserting files
create policy "Users can read/insert their own files"
on storage.buckets
for insert
to authenticated
using (
  auth.uid() = owner
)
with check (
  auth.uid() = owner
);

-- Rule for updating and deleting files
create policy "Users can update/delete their own files"
on storage.buckets
for all
to authenticated
using (
  auth.uid() = owner
)
with check (
  auth.uid() = owner
);
```
