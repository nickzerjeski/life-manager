# Architecture

LifeManager is a web application that combines a React frontend, a Supabase backend and an AI-assisted planning pipeline. The system turns high level goals into scheduled tasks and synchronises them with Google Calendar.

## Overview
- **Frontend** – Single Page Application built with React, TypeScript, Vite and Tailwind CSS.
- **Backend** – Supabase provides authentication, database and object storage. SQL scripts in `backend/setup` define the schema for goals, projects, tasks and supporting metadata.
- **AI Pipeline** – An n8n workflow calls OpenAI models to analyse user documents and context, generate projects and tasks and estimate durations.
- **Scheduler** – A deterministic service queries Google Calendar for free/busy slots and inserts task blocks while respecting dependencies and deadlines.

## Data Flow
1. Users create or upload information through the frontend.
2. The frontend persists state and files to Supabase.
3. Supabase triggers an n8n workflow when AI-assisted planning is requested.
4. The workflow invokes OpenAI to break goals into projects and tasks.
5. Generated tasks are stored in Supabase and scheduled onto the user's calendar.

## Source Layout
```
app/            # React client
backend/        # Supabase SQL and agent configuration
```
Existing documentation within this folder further details each part of the system.
