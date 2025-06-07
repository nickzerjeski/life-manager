# LifeManager Blueprint

## Purpose
This document outlines the high‑level goals and architecture of the **LifeManager** project.

## Core Features
- Goal, Project and Task management connected to Google Calendar.
- AI‑assisted planning that expands a goal into projects and tasks.
- Intelligent scheduler that respects durations, deadlines and dependencies.
- Cloud document storage for project references and AI context.
- Offline‑capable PWA with an optional Electron desktop shell.
- Authentication via Google OAuth with JWT‑based sessions.

## Architecture Overview
- **Client**: React, Next.js and Tailwind CSS.
- **Server**: Node.js REST API with n8n orchestrating OpenAI workflows.
- **Storage**: PostgreSQL for metadata and an S3‑compatible bucket for documents.
- **Calendar**: Google Calendar API for free/busy lookups and event creation.

## Development Principles
- Keep components focused and test with Vitest beside each source file.
- Apply Tailwind utility classes; interactive elements use the `blue-600` palette.
- Maintain ≥ 80% unit test coverage and run `npm run lint` before committing.

LifeManager turns big aspirations into achievable tasks so users can focus on execution, not planning.
