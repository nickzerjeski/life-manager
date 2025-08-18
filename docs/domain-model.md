# Domain Model

LifeManager centres on four primary entities with supporting types.

## Goal
Represents a high level outcome within a specific period.
**Fields**: `id`, `name`, `period {from,to}`, `status`, `areaOfLife`, `documents[]`, `projects[]`.

## Project
Breaks a goal into manageable chunks.
**Fields**: `id`, `name`, `contributionPct`, `status`, `tasks[]`, `documents[]`, `goalId`.

## Task
Atomic action scheduled on the calendar.
**Fields**: `id`, `name`, `description`, `duration`, `priority`, `dependencyIds[]`, `completed`, optional `projectId`.

## Document
Stored reference material linked to goals, projects or tasks.
**Fields**: `id`, `name`, `type`, `path`, `goalId`, optional `projectId` and `topicId`.

## Supporting Types
- **Topic** – groups related documents.
- **AOL** – enumeration of "areas of life" tags.
- **Status** – common status progression (`NotStarted`, `OnTrack`, `AtRisk`, `OffTrack`, `Achieved`).
- **User** – profile returned from Supabase authentication.

Handlers in `app/src/models/*Handler.ts` provide helper methods for manipulating these models both on the client and during backend workflows.
