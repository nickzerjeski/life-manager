# RAG Agent Setup

This is the stup guide for the RAG agent in n8n.

## Requirements

- Have **Supabase** installed (includes PostgreSQL and REST API) and the n8n container added to its docker network
- Have **n8n** installed
- Have **OpenAI Credential** set up


## Setup

1. Enable the `pgvector` extension in PostgreSQL. For that, go to the Supabase Dashboard and run:
   ```sql
   create extension if not exists vector;
   ```

2. In n8n, add credentials for Supabase and Postgres:
### Supabase
- Name: `Local Supabase API`
- Type: `Supabase API`
- Fields:
  - URL: `host:8000`
  - API Key: `anon`, `service_role` key
### Postgres
- Name: `Local Supabase Postgres`
- Type: `PostgreSQL`
- Fields:
  - Host: `supabase-db`
  - Database `postgres`
  - User: `postgres`
  - Password: `POSTGRES_PASSWORD`
  - Port: `5432`

Note that n8n and supabase have to run on the same host machine in order for this setup to work.
