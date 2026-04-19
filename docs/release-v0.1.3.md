# Release v0.1.3

Date: 2026-04-19

## Changelog (short)

- Fixed npm package contents to ship only CLI build output and scaffold templates.
- Updated CLI template resolution to support both published-package mode and monorepo development mode.
- Added missing `@types/node` in both templates to ensure generated projects build without manual fixes.
- Completed dogfood validation from published CLI (`npx`) for both `landing` and `dashboard` templates.

## Validation snapshot

- Published package: `create-auralith-app@0.1.3`
- Landing scaffold from npm: `dev` startup and `build` passed
- Dashboard scaffold from npm: `dev` startup and `build` passed

## Notes

- Previous patch versions (`0.1.0`, `0.1.1`, `0.1.2`) are superseded by `0.1.3`.
