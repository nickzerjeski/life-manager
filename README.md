# LifeManager
## Purpose
LifeManager accelerates personal goal attainment by turning a high-level aspiration (“Goal”) into intermediate deliverables (“Projects”) and executable work items (“Tasks”), then inserting those tasks into Google Calendar while respecting dependencies, durations, priorities, and deadlines. An AI pipeline handles the initial decomposition and estimation so that users focus on execution, not planning.
## Key Features
- Goal Management – Create quantitative or qualitative goals; define period, area-of-life tag, attach documents, and monitor automatic status updates.
- Project Management – Break goals into projects confined to the goal period; track progress, status, and related documents.
- Task Management – Generate or manually add tasks ≤ 24 h, assign dependencies and priority 1-5; mark complete or reschedule.
- AI-Assisted Planning – Backend webhook triggers an n8n workflow calling OpenAI to analyse documents and context, generate projects and tasks, and estimate durations.
- Intelligent Scheduler – Deterministic service queries Google Calendar free/busy slots, inserts task blocks, and adjusts when tasks slip or constraints change.
- Dynamic Status Evaluation – Goal and project status progress through Not started → On Track → At Risk → Off Track → Achieved based on remaining work versus time.
- Cloud Document Storage – Upload PDF, Markdown, or plain-text references; link each file to a goal, project, or task for future AI context.
- Quick Project Generation – Use the new button in the Projects tab to request auto-generated projects from the backend.
- Document Management – Upload files from the Documents tab and remove them individually.
- Authentication – Google OAuth initiates authorisation; backend issues session JWTs for API calls.
- Offline Support – Progressive Web App caches critical assets and state; synchronises on reconnection.
- Desktop Option – Electron shell packages the same codebase for Windows, macOS, and Linux.
- CI – ESLint with Airbnb TypeScript rules; GitHub Actions gate merges.
## Domain Concepts
### Goal
- Quantitative: track start, current, and target numeric values
- Qualitative: binary progress (0 → 1)
- Fields: `id`, `name`, `period{from,to}`, `status`, `areaOfLife`, `documents[]`, `projects[]`
### Project
- Always linked to one goal
- Period lies inside the parent goal period
- Fields: `id`, `name`, progress metrics, `contributionPct`, `status`, `tasks[]`, `documents[]`
### Task
- Atomic action ≤ 1 440 min
- Fields: `id`, `name`, `description`, `duration`, `priority`, `dependencyIds[]`, `completed`, optional `projectId`
### Document
- Types accepted: PDF, Markdown, plain text and excel spreadsheets
- Stored in cloud bucket; Interacting with these files is referenced in `/docs/supabase-bucket-operations.md`
- Files live in a `documents` bucket structured as:
  - `<user-id>/<goal-id>/` for all goal related files.
  - `<user-id>/<goal-id>/<project-id>/` for all project related files.
  - `<user-id>/<goal-id>/<project-id>/<topic-id>/` for all topic related files.
## Scheduling Logic
1. Pull Google Calendar free/busy intervals for the goal period.
2. Build a DAG from task dependencies and sort topologically.
3. Place each task into the earliest slot that satisfies:
    - slot duration ≥ task duration
    - slot end ≤ task deadline (project period)
    - no calendar overlap
4.  If placement fails, mark project At Risk or Off Track.
5. Re-evaluate after any task completion, deadline change, or new event.
## Tech Stack
- Client: React, TypeScript, Vite, Tailwind CSS
- Backend: Supabase, n8n
- AI: OpenAI Chat Completions (gpt-4o) and embeddings
- Storage: Supabase Buckets
## Development Workflow
1. Install dependencies with `npm install`.
3. Start frontend with `npm run dev`.
4. Lint with `npm run lint`.
5. Build production assets with `npm run build`.

