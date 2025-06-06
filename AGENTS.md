# AGENTS.md

## Purpose
-

## Directory guide
-

## Commands
- `npm run dev`      – Vite dev server
- `npm run build`    – Production PWA build
- `npm run lint`     – ESLint
- `npm run electron` – Desktop shell
- `npm test`         – Vitest unit tests

## Coding conventions
-

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
