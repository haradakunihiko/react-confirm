# Repository Guidelines

## Project Structure & Module Organization
- `src/`: TypeScript sources for the library (e.g., `index.ts`, `createConfirmation.ts`, `mounter/`).
- `__tests__/`: Jest tests, including TypeScript-specific tests in `__tests__/typescript/`.
- `dist/`: Compiled output published to npm (`index.js`, `index.d.ts`). Do not edit.
- Root configs: `tsconfig*.json`, `jest.config.js`, `package.json`.

## Build, Test, and Development Commands
- `npm run build`: Compile TypeScript to `dist/` using `tsc -p tsconfig.build.json`.
- `npm test`: Run Jest unit/integration tests in Node + JSDOM.
- `npm run test:types`: Run type-focused tests under `__tests__/typescript/`.
- `npm run typecheck`: Type-check the codebase without emitting files.
- `npm run clean`: Remove `dist/` before a fresh build.

Examples:
- Clean build: `npm run clean && npm run build`
- Pre-publish check (what CI does): `npm run clean && npm run build && npm test`

## Coding Style & Naming Conventions
- Language: TypeScript + React 18.
- Indentation: 2 spaces; prefer named exports; keep files small and focused.
- Naming: `camelCase` for variables/functions, `PascalCase` for React components and types (e.g., `ConfirmDialogProps`).
- Imports: relative within `src/`; the Jest alias maps `^src$` to `src/index.ts` for tests.

## Testing Guidelines
- Framework: Jest with `jest-environment-jsdom` and `ts-jest`.
- Location: Place tests in `__tests__/` mirroring `src/` structure; use `*.test.(ts|tsx|js)`.
- Coverage: Config collects from `src/**/*.{js,ts,tsx}`; aim to exercise both success and rejection paths for confirmations.
- Type tests: Add new cases under `__tests__/typescript/` when changing public types or generics.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`, `chore:`). Keep messages imperative and scoped.
- PRs: Include a concise description, linked issue (if any), test coverage for behavior/typing, and screenshots or code snippets when UI behavior changes.
- CI expectations: PRs should pass build, unit tests, and type checks.

## Security & Compatibility
- Peer deps: This library targets React 18 (`react`, `react-dom`). Verify compatibility when upgrading.
- Public API: Changes to exported types or entries in `src/index.ts` are breaking; document in release notes.
