# Backend

The backend relies on Supabase for data storage, authentication and object buckets, with n8n workflows orchestrating AI-driven planning.

## Supabase Schema
SQL files in `backend/setup` create the core tables and vector indexes:
- `goals.sql`, `projects.sql`, `tasks.sql` and `topics.sql` define primary entities and their relations.
- `doc_rows.sql`, `doc_metadata.sql` and `doc_emb.sql` manage document storage and embeddings for retrieval augmented generation.

## Agents
`backend/agents/rag_agent.json` configures a retrieval agent used by the n8n pipeline to transform uploaded documents into projects and tasks via OpenAI models.

## Workflows
An n8n workflow watches for user requests and performs:
1. Fetch context and documents from Supabase.
2. Call OpenAI through the configured agent.
3. Insert generated projects and tasks into the database.

## Scheduling Service
A deterministic scheduler communicates with Google Calendar to place tasks in free slots, updating status when deadlines shift.

Refer to `docs/setup-backend.md` for provisioning and configuration instructions and to `docs/supabase-bucket-operation.md` for managing file uploads.
