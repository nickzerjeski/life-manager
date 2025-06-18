# Info
For this project, [Supabase](https://supabase.com/) is used as backend.
# Preliminaries
Have Supabased setup with Docker and add the n8n container to the docker network
# Credentials
In n8n, add credentials for Supabase and Postgres:
## Supabase
- Name: `Local Supabase API`
- Type: `Supabase API`
- Fields:
  - URL: `https://sb.nickzerjeski.me`
  - API Key: `SERVICE_ROLE_KEY`
## Postgres
- Name: `Local Supabase Postgres`
- Type: `PostgreSQL`
- Fields:
  - Host: `supabase-db`
  - Database `postgres`
  - User: `postgres`
  - Password: `POSTGRES_PASSWORD`
  - Port: `5432`
# Setup
1. Create a domain and map http requests to that domain to `localhost:8000`. That is the supabase container.
2. Go to that domain and log in with the credentials provided in the `.env` file.
3. Add a `documents` bucket and add following policy to it:
```
bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
```
4. Run the sql queries from `backend/setup` to create tables.
