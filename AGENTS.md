# AGENTS.md

## Purpose
Guides contributors on repository structure and coding style.

## Directory guide
- `src/` – React and Next.js application code
  - `app/` – page routing and layout files
  - `components/` – reusable UI pieces
  - `models/` – TypeScript domain models
  - `ai/` – AI workflow helpers
  - `hooks/` – custom React hooks
- `docs/` – project documentation

## Commands
- `npm run dev`      – Vite dev server
- `npm run build`    – Production PWA build
- `npm run lint`     – ESLint
- `npm run electron` – Desktop shell
- `npm test`         – Vitest unit tests

## Coding conventions
- Use TypeScript and React function components.
- Place tests beside source files using `*.test.ts`.
- Prefer named exports and keep components small.

## Testing
Write unit tests in `*.test.ts` beside source files. Achieve ≥ 80 % statement coverage. Use Vitest.

## Usage notes for Codex
When adding new features, update corresponding domain model first, then UI. Run `npm run lint` and ensure tests pass before committing.
For project information and structure read `README.md`. 

## Styleguide
- Use Tailwind CSS utility classes exclusively for styling.
- Primary color: `blue-600` for interactive elements.
- Buttons: `px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700`.
- Cards and panels: `bg-white shadow rounded p-4` with `text-gray-800`.
- Sidebar background: `bg-gray-800 text-white`; header background uses the primary color.
- Keep typography simple: `text-xl font-bold` for page titles.
