# Session Memory

Last updated: 2026-04-19

## Cross-repo rule

- `/home/danilo-gomes/frz-community` is a work repository.
- Do not treat `frz-community` as part of personal repositories by default.
- Never modify `frz-community` unless the user explicitly requests actions in that repository.

## Where we are

- Repository: `auralith-stack`
- Branch: `main`
- Latest completed milestone state: v0.2 template refresh in progress and merged to main.
- Key commit for current template refresh: `5ff13a1` (`feat: refresh landing and dashboard templates with product-grade UX`).

## What was completed

- Auralith Stack base delivered (CLI + templates + docs).
- Milestone 3 validation and release notes completed.
- Milestone 4 release checklist executed.
- npm package `create-auralith-app` published and fixed through versions; validated target version is `0.1.3`.
- GitHub release created: `v0.1.3`.
- Deprecated npm versions: `0.1.0`, `0.1.1`, `0.1.2`.
- CI workflow added to validate scaffold + template builds on push/PR.
- Changelogs added in EN and PT-BR.
- Design spec created: `docs/design-spec-v0.2.md`.

## Current local examples

- Existing examples:
  - `/home/danilo-gomes/auralith-examples/example-landing`
  - `/home/danilo-gomes/auralith-examples/example-dashboard`
- New v2 examples generated from local CLI:
  - `/home/danilo-gomes/auralith-examples/example-landing-v2`
  - `/home/danilo-gomes/auralith-examples/example-dashboard-v2`

## Open next steps

1. Decide whether to replace old examples with v2 versions.
2. If approved, regenerate/overwrite `example-landing` and `example-dashboard` from updated templates.
3. Optionally publish a new npm version for `create-auralith-app` to include v0.2 template improvements.
4. Continue post-MVP work (ISSUE-016): `auralith add section <name>` command.

## Fast resume prompt

Use this when reopening work:

"Retomar do commit `5ff13a1` no `auralith-stack`, manter v2 templates como base, e continuar pelos passos abertos em `MEMORY.md`."
