# Changelog

All notable changes to Auralith Stack are documented in this file.

## v0.1.3 - 2026-04-19

### Milestone 1 - CLI Foundation

- Bootstrapped monorepo structure with `packages/`, `templates/`, and `docs/`.
- Implemented `create-auralith-app` CLI with argument parsing and help output.
- Added scaffolding flow with template copy and placeholder replacement (`__APP_NAME__`, `__PACKAGE_NAME__`).
- Added optional dependency install and git init automation with next-step guidance.

### Milestone 2 - Template Quality

- Delivered `landing` and `dashboard` templates with shared conventions.
- Integrated baseline UX features in both templates: theme mode, PT/EN language switch, responsive layout, and contact UI states.
- Added and documented stack conventions in `docs/conventions.md`.

### Milestone 3 - Contact + Deploy Recipes

- Standardized contact environment keys in both templates using `.env.example`.
- Implemented contact submit strategy with Supabase primary path and FormSubmit mirror/fallback.
- Added GitHub Pages workflow recipe with dynamic `VITE_BASE_PATH` and `gh-pages` publish strategy.
- Added Vercel deployment recipe for Vite SPA projects.
- Validated milestone issues and smoke builds (landing + dashboard).

### Milestone 4 - Polish + Release

- Improved CLI DX with actionable validation and recovery hints:
  - unknown options,
  - missing/invalid option values,
  - invalid project names,
  - non-empty target directory,
  - install/git remediation behavior.
- Expanded onboarding docs (`README.md`, `docs/getting-started.md`) with quickstart and command examples.
- Fixed npm packaging for published CLI:
  - package now ships only `dist` and `templates`,
  - template resolution supports monorepo and published-package execution.
- Added missing `@types/node` to template dev dependencies so generated apps build without manual fixes.
- Completed dogfood validation from published package (`npx create-auralith-app@0.1.3`) for both templates (`dev` startup + `build`).

### Release notes

- Tag: `v0.1.3`
- npm: `create-auralith-app@0.1.3`
- Deprecated npm versions: `0.1.0`, `0.1.1`, `0.1.2` (superseded by `0.1.3`).
