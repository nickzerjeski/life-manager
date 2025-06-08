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
- Fields: `id`, `name`, progress metrics, `status`, `tasks[]`, `documents[]`
### Task
- Atomic action ≤ 1 440 min
- Fields: `id`, `name`, `description`, `duration`, `priority`, `dependencyIds[]`, `completed`, optional `projectId`
### Document
- Types accepted: PDF, Markdown, plain text
- Stored in cloud bucket; metadata keeps `id`, `filename`, `contentType`, and ownership reference
## AI Pipeline
1. Trigger – User presses Start Goal; client POSTs `/ai/expand-goal` with goal ID and document references.
2. Workflow – n8n retrieves documents, feeds cleaned text and metadata to OpenAI.
3. LLM Output – JSON list of projects and tasks with names, descriptions, durations, dependencies, and priority hints.
4. Validation – Backend enforces schema rules, persists new objects.
5. Client Sync – WebSocket or long-poll delivers objects to the client store.
## Scheduling Logic
1. Pull Google Calendar free/busy intervals for the goal period.
2. Build a DAG from task dependencies and sort topologically.
3. Place each task into the earliest slot that satisfies:
    - slot duration ≥ task duration
    - slot end ≤ task deadline (project period)
    - no calendar overlap
4.  If placement fails, mark project At Risk or Off Track.
5. Re-evaluate after any task completion, deadline change, or new event.
## Status Algorithm
|Condition   |Status   |
|---|---|
|No tasks started   |Not started   |
|`workRemaining / daysRemaining ≤ nominalRate`   |On Track   |
|Above nominal rate but deadline feasible   |At Risk   |
|Deadline infeasible   |Off Track   |
|All work complete   |Achieved  |

`nominalRate` defaults to 1 h per calendar day.
## REST API
- `POST /auth/google` → 200 { token }
- `GET /goals`
- `POST /goals`
- `PATCH /goals/{id}`
- `POST /goals/{id}/start` (AI trigger)
- `GET /projects?goal={id}`
- `PATCH /tasks/{id}/complete`
- `POST /documents/upload-url` (presign PUT)
- `POST /calendar/sync`
## Tech Stack
- Client: React, TypeScript, Next.js, Tailwind CSS
- Backend: Language-agnostic REST (reference Node.js), n8n for AI orchestration
- AI: OpenAI Chat Completions (gpt-4o) and embeddings
- Storage: PostgreSQL for metadata, S3-compatible bucket for documents
- Calendar: Google Calendar API v3
- Desktop: Electron 30 with context isolation
- CI/CD: GitHub Actions, codecov
## Development Workflow
1. Install dependencies with `npm install`.
2. Run the backend server using `npm run server` and keep it running.
3. In another terminal start the dev server with `npm run dev`.
4. Lint with `npm run lint`.
5. Build production assets with `npm run build`.

