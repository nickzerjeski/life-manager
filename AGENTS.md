# AGENTS.md

## Purpose
LifeManager is a React + TypeScript PWA with an optional Electron shell. It manages Goals, Projects, and Tasks and schedules work into Google Calendar.

## Directory guide
- `src/domain` holds immutable business logic, no React imports.
- `src/ui` contains purely presentational components styled with Tailwind.
- `schedulingService.ts` must remain pure and fully unit-tested.

## Commands
- `npm run dev`      – Vite dev server
- `npm run build`    – Production PWA build
- `npm run lint`     – ESLint
- `npm run electron` – Desktop shell
- `npm test`         – Vitest unit tests

## Coding conventions
Use strict TypeScript, functional components, React Hooks, and Zustand for state. Prefer composition over inheritance. Do not import from React in domain layer.

## Testing
Write unit tests in `*.test.ts` beside source files. Achieve ≥ 80 % statement coverage. Use Vitest.

## Usage notes for Codex
When adding new features, update corresponding domain model first, then UI. Run `npm run lint` and ensure tests pass before committing.
For project information and structure read `README.md`. 
