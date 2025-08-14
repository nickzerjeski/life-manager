# AGENTS.md

## Purpose
Guides contributors on repository structure and coding style.

## Directory guide
TODO

## Commands
- `npm run dev`      – Vite dev server
- `npm run build`    – Production build with Vite
- `npm run lint`     – ESLint
- `npm run electron` – Desktop shell
- `npm test`         – Vitest unit tests with coverage

## Coding conventions
- Use TypeScript and React function components.
- Place tests beside source files using `*.test.ts`.
- Prefer named exports and keep components small.

## Testing
- Run `npm test` to execute unit tests.
- Coverage output is written to `app/coverage`.
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
