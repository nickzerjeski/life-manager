# Frontend

The client is a React application located under the `app/` directory and bootstrapped with Vite. It uses TypeScript and Tailwind CSS for rapid UI development.

## Directory Structure
```
app/
 └─ src/
    ├─ pages/        # Route components such as Home, Goal, Project and Login
    ├─ components/   # Reusable UI elements and views
    ├─ hooks/        # Custom React hooks (auth, mobile detection, toast)
    ├─ modals/       # Dialog components for creating goals, projects and folders
    ├─ models/       # TypeScript models and handlers for domain entities
    ├─ utils/        # General utilities
    └─ styles/       # Global Tailwind definitions
```

## Pages
Each file in `pages/` represents a top-level route. Key screens include:
- `HomePage` – entry point after login showing all tasks and an option to create new ones.
- `GoalPage` and `ProjectPage` – manage goals, projects and their tasks.
- `HabitPage` – track recurring habits.
- `LoginPage` and `RegisterPage` – authentication flows using Supabase.
- `SettingPage` – user preferences.

## Components
Reusable building blocks live in `components/`:
- `ui/` – foundational controls (buttons, inputs, dialogs, tables, etc.) styled according to `docs/style-guide.md`.
- `views/` – higher level compositions such as dashboards.
- `fields/` and `tabs/` – form elements and tab navigation helpers.

`RootLayout.tsx` defines the shell that wraps all pages.

## Hooks
Custom hooks simplify common tasks:
- `use-auth` – manages Supabase authentication state.
- `use-toast` – global toast notifications.
- `use-mobile` – detects small screen layouts.

## Models
Files under `models/` mirror the domain entities (Goal, Project, Task, Document, etc.) and provide helper classes for manipulating them on the client.

## Supabase Client
`app/supabase.ts` exports an initialised Supabase client which pages and hooks use for data access.
