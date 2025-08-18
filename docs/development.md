# Development

## Prerequisites
- Node.js 18+
- npm

## Installation
```
npm install
```

## Useful Scripts
- `npm run dev` – start the Vite development server.
- `npm run build` – build production assets.
- `npm run lint` – run ESLint across the project.
- `npm test` – execute unit tests with Vitest and collect coverage.
- `npm run electron` – launch the Electron desktop shell.

## Testing
Unit tests live beside source files using the `*.test.ts` convention. Run `npm test` to execute them; coverage reports are written to `app/coverage`.

## Conventions
- Follow the component styling rules in `docs/style-guide.md`.
- Add tests when modifying or creating features.
- Commit changes with descriptive messages and ensure the working tree is clean.
