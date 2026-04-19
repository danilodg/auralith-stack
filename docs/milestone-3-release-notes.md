# Milestone 3 Release Notes

Date: 2026-04-19

## Highlights

- Validated Milestone 3 issues (ISSUE-008 to ISSUE-011) and marked checklists complete.
- Confirmed contact env parity across templates (`landing` and `dashboard`).
- Confirmed contact submit strategy behavior (Supabase primary + FormSubmit mirror/fallback).
- Confirmed GitHub Pages workflow recipe and dynamic `VITE_BASE_PATH` behavior.
- Confirmed Vercel recipe completeness for build settings and required variables.

## Validation Evidence

- Generated smoke projects from current CLI build:
  - `smoke-m3-landing`
  - `smoke-m3-dashboard`
- For both smoke projects:
  - `npm install` succeeded
  - `npm run build` succeeded
- Temporary smoke directories were removed after validation.

## Notes

- Issue status and validation details are tracked in `docs/milestone-3-issues.md`.
