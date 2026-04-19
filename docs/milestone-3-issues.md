# Milestone 3 - Issue Validation

This file tracks validation status for Milestone 3 issues.

## ISSUE-008 - Standardize contact env configuration

### Goal
Ensure both templates expose the same contact env variables and docs.

### Checklist
- [x] `templates/landing/.env.example` includes all contact vars
- [x] `templates/dashboard/.env.example` includes all contact vars
- [x] Variable names match exactly in both templates
- [x] `README.md` references env setup path

### Required variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_CONTACT_FUNCTION`
- `VITE_CONTACT_EMAIL`
- `VITE_FORMSUBMIT_TOKEN`

### Acceptance criteria
- New projects from CLI always include a complete `.env.example`.

### Validation notes
- Verified both `.env.example` files include identical contact variables.
- Verified deploy docs list required env setup for generated projects.

---

## ISSUE-009 - Implement contact submit strategy

### Goal
Use Supabase as primary submit path and FormSubmit as mirror/fallback.

### Checklist
- [x] Landing template submits to Supabase Edge Function
- [x] Landing template submits to FormSubmit endpoint/token when configured
- [x] Dashboard template submits to Supabase Edge Function
- [x] Dashboard template submits to FormSubmit endpoint/token when configured
- [x] Both templates show statuses: `idle`, `sending`, `success`, `error`
- [x] Phone masking exists in UI and payload includes phone

### Acceptance criteria
- Form submit works in both templates with no extra code edits after scaffold.

### Validation notes
- Smoke projects generated from current CLI build include the full contact flow.
- `smoke-m3-landing` and `smoke-m3-dashboard` both install and build successfully.

---

## ISSUE-010 - GitHub Pages recipe validation

### Goal
Guarantee deploy workflow works out of the box for generated apps.

### Checklist
- [x] Workflow uses gh-pages branch deploy action
- [x] Build step injects all `VITE_*` secrets
- [x] `VITE_BASE_PATH` is set dynamically from repo name
- [x] Docs include required repo settings and secrets

### Acceptance criteria
- A generated template can be deployed to Pages following docs only.

### Validation notes
- Both template workflows use `peaceiris/actions-gh-pages@v4` and publish `dist`.
- Workflow computes `VITE_BASE_PATH` from repository name with user/org site handling.

---

## ISSUE-011 - Vercel recipe validation

### Goal
Make Vercel deployment straightforward for generated apps.

### Checklist
- [x] Vite settings documented (`build`, `dist`)
- [x] Required `VITE_*` variables listed
- [x] Contact flow validation steps documented

### Acceptance criteria
- User can deploy to Vercel in a single pass with no missing steps.

### Validation notes
- `docs/deploy/vercel.md` includes build/output configuration and all contact variables.
- Verification steps cover theme/language and contact submit flow checks.
