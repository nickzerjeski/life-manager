# AGENTS.md

## Purpose
Guides contributors on repository structure and coding style.

## Directory guide
- `src/` – React application code (bundled with Vite)
  - `app/` – page routing and layout files
  - `components/` – reusable UI pieces
  - `models/` – TypeScript domain models
  - `ai/` – AI workflow helpers
  - `hooks/` – custom React hooks
- `docs/` – project documentation

## Commands
- `npm run dev`      – Vite dev server
- `npm run build`    – Production build with Vite
- `npm run lint`     – ESLint
- `npm run electron` – Desktop shell

## Coding conventions
- Use TypeScript and React function components.
- Place tests beside source files using `*.test.ts`.
- Prefer named exports and keep components small.

## Testing
Unit tests are not yet configured.
## Usage notes for Codex
When adding new features, update corresponding domain model first, then UI. Run `npm run lint` before committing.
For project information and structure read `README.md`.
Refer to `docs/style-guide.md` for component styling details.

## Styleguide
- Use Tailwind CSS utility classes exclusively for styling.
- Primary color: `blue-600` for interactive elements.
- Buttons: `px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700`.
- Cards and panels: `bg-white shadow rounded p-4` with `text-gray-800`.
- Sidebar background: `bg-gray-800 text-white`; header background uses the primary color.
- Keep typography simple: `text-xl font-bold` for page titles.
