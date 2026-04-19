# Auralith Stack Conventions

This document defines the default conventions used by Auralith Stack templates.

## 1) Project structure

Use this baseline structure for app projects:

```text
src/
  App.tsx
  main.tsx
  styles.css
  components/
  sections/
  content/
  hooks/
  lib/
```

Guidelines:

- `components/`: reusable UI blocks.
- `sections/`: page-level sections with local composition.
- `content/`: static content dictionaries (labels, copy, i18n text).
- `hooks/`: custom hooks (`useXxx.ts`).
- `lib/`: helpers and shared utilities.

## 2) Naming and files

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Utility/config files: `kebab-case.ts`
- Keep one component per file unless tightly coupled.

## 3) UI and design rules

- Use `auralith-ui` components first.
- Avoid recreating primitives already available in the library.
- Keep spacing compact and consistent.
- Prefer explicit section hierarchy:
  - label (`SectionLabel`)
  - heading
  - description
  - actionable controls

## 4) Theme mode

Every template should support:

- `dark`
- `light`
- `system`

Pattern:

- Store mode in localStorage key `auralith-theme-mode`.
- Apply `data-theme="light"` for light mode.
- Remove attribute for dark mode default.

## 5) Language baseline

Templates should provide PT/EN baseline through a simple dictionary object in `App.tsx` or `content/`.

Pattern:

- Language type: `type Language = 'pt' | 'en'`
- Browser fallback on first load (`navigator.language`).
- Language switch in UI.

## 6) Contact flow

Default strategy:

1. Submit to Supabase Edge Function (`contact-lead`) as primary.
2. Submit to FormSubmit endpoint/token as fallback or mirror.
3. Show clear status in the form (`idle`, `sending`, `success`, `error`).

Phone handling:

- Mask in UI.
- Backend normalizes to digits.

## 7) Environment variables

Templates must include `.env.example` with:

```bash
VITE_CONTACT_EMAIL=
VITE_FORMSUBMIT_TOKEN=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_CONTACT_FUNCTION=contact-lead
```

Important:

- `VITE_*` are public at build time.
- Never expose service-role keys in frontend apps.

## 8) Deploy conventions

GitHub Pages:

- Use `VITE_BASE_PATH` from repository name.
- Deploy `dist` to `gh-pages` branch in workflow.
- Configure required repository secrets.

Vercel:

- Standard Vite build.
- Set same `VITE_*` variables in project settings.

## 9) Quality checks

Before release/template update:

1. `npm run build` must pass.
2. Generated app from CLI must run without manual patching.
3. Contact submit behavior must be verified (Supabase + FormSubmit path).
4. Mobile and desktop layout must be checked.
