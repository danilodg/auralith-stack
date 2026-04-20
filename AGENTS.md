# AGENTS

## Repo shape
- Monorepo-style structure focused on scaffolding starter apps.
- Main areas:
  - `packages/create-auralith-app/`: CLI package source and templates consumed by `npx create-auralith-app`.
  - `templates/`: standalone template copies (`landing`, `dashboard`) for direct reference.
  - `docs/`: product, release, and deploy documentation.

## Primary purpose
- This repo is not a single app runtime.
- Core deliverable is the CLI (`create-auralith-app`) plus starter templates.

## Key commands
- CLI package (inside `packages/create-auralith-app`):
  - `npm install`
  - `npm run build`
  - `npm run dev`
- Root-level local smoke flow:
  - `node packages/create-auralith-app/dist/index.js my-app --template landing --skip-prompts --no-install --no-git`

## CI behavior
- CI builds CLI, scaffolds `landing` and `dashboard` smoke apps, installs dependencies, and runs `npm run build` on generated apps.
- Workflow file: `.github/workflows/ci.yml`.

## Editing guidance
- If changing scaffolding behavior, update both:
  - `packages/create-auralith-app/src/index.ts`
  - template files under `packages/create-auralith-app/templates/*`
- Keep `templates/*` in sync with packaged templates when intended by release scope.
- Do not hand-edit generated outputs if they are expected to be copied from template sources.

## Docs sync rule
- Any change in CLI flags, scaffold defaults, template behavior, or deployment flow must update docs:
  - `README.md`
  - `docs/getting-started.md`
  - `docs/conventions.md`
  - deploy docs under `docs/deploy/*` when applicable.

## Validation order
1. `npm run build` in `packages/create-auralith-app`.
2. Scaffold at least one template locally (`landing` and ideally `dashboard`).
3. Run `npm install && npm run build` in generated app(s).
