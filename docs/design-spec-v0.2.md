# Design Spec v0.2 (Landing + Dashboard)

Date: 2026-04-19

## Objective

Raise template quality from starter/demo to product-grade examples while preserving fast scaffold experience.

Primary goals:

- Strong visual identity per template (no generic Vite feel).
- Heavy usage of Auralith UI components, especially `Select`.
- Better information architecture and realistic sample content.
- Maintain full responsiveness, accessibility, and build reliability.

## Current gaps to close

- Top controls still use native `<select>` in both templates.
- Sections read as placeholders instead of real business examples.
- Visual hierarchy is valid but not distinctive enough.
- Dashboard filters are shallow and do not highlight component value.

## Visual direction

### Landing - "Editorial Product Marketing"

- Tone: premium, narrative, trust-first.
- Layout rhythm: hero -> trust/use-cases -> ROI selector -> contact.
- Typography: expressive headline scale, quieter body copy.
- Background: layered atmosphere (already using `SiteBackground`, keep and tune intensity).

### Dashboard - "Operational SaaS Cockpit"

- Tone: focused, data-first, decision-oriented.
- Layout rhythm: context bar -> KPI strip -> filters -> table -> support panel.
- Density: medium (more data on screen, still touch-friendly on mobile).
- Status emphasis: clear semantic badges and risk visibility.

## Component strategy (Auralith UI first)

Use Auralith primitives as defaults for all interactive and structural pieces:

- `GlassPanel`, `Card`, `Tag`, `Button`, `Input`, `Textarea`, `SectionLabel`, `SiteBackground`.
- Replace every native `<select>` with Auralith `Select` component:
  - language switch,
  - theme switch,
  - landing pricing cycle,
  - landing integration filter,
  - dashboard period filter,
  - dashboard segment filter,
  - dashboard status filter.

If `Select` API differs between local and published package, align templates with the local `auralith-ui` API and keep one adapter function in template code if needed.

## Information architecture updates

### Landing sections

1. Hero with two CTA actions and one trust strip.
2. Use-case cards (3) with measurable outcomes.
3. Plan/ROI block controlled by `Select` (Monthly/Yearly).
4. Integration block with `Select`-driven filtering.
5. Contact block (already wired) with stronger visual hierarchy.

### Dashboard sections

1. Context header (`workspace`, `last sync`, `environment`).
2. KPI row (MRR, Churn, Activation, NPS).
3. Filter toolbar with three `Select` controls + search.
4. Table with realistic rows and status tagging.
5. Support/contact panel with existing lead flow.

## Content quality baseline

- Avoid generic labels like "Service 1" or placeholder copy.
- Every card/metric must imply a business action.
- Keep PT/EN parity for all newly added labels.
- Keep language compact and scannable.

## Motion and interaction

- Add subtle staggered reveal for hero/cards/table rows on first paint.
- Add meaningful hover transitions on cards and CTAs.
- Preserve reduced-motion friendliness (disable transitions when preferred).
- Keep form status transitions explicit (`idle`, `sending`, `success`, `error`).

## Accessibility and responsiveness

- Ensure `Select` and form controls are keyboard reachable.
- Ensure visible focus ring on all interactive controls.
- Maintain AA contrast for text/status states.
- Mobile-first behavior:
  - collapse multi-column grids under 720px,
  - avoid overflow in toolbar/filter areas,
  - maintain minimum touch target around 40px.

## Implementation plan (file-level)

### Landing

- `templates/landing/src/App.tsx`
  - Replace topbar selects with Auralith `Select`.
  - Add pricing and integration sections driven by `Select` state.
  - Improve copy structure and section order.
- `templates/landing/src/styles.css`
  - Add stronger typographic scale and spacing tokens.
  - Improve card, hero, and CTA emphasis.
  - Add reveal/hover motion classes.

### Dashboard

- `templates/dashboard/src/App.tsx`
  - Replace topbar selects with Auralith `Select`.
  - Add filter state for period/segment/status via `Select`.
  - Expand rows and metric meaning.
- `templates/dashboard/src/styles.css`
  - Improve dense-but-clean grid behavior.
  - Tune table area, badge hierarchy, and toolbar alignment.
  - Add subtle reveal interactions.

## Dev loop without npm publish

Use local iteration loop:

1. Build CLI locally (`packages/create-auralith-app`).
2. Scaffold playground apps with local `dist/index.js`.
3. Link local `auralith-ui` into playground apps.
4. Run `dev` side-by-side (landing + dashboard).
5. Backport validated changes to template source files.

This avoids publishing on each UI tweak.

## Acceptance criteria for v0.2 template refresh

- Both templates use Auralith `Select` for all dropdown interactions.
- Both templates present realistic, non-placeholder product examples.
- `npm run build` passes for both templates and fresh scaffolds.
- Mobile and desktop layouts remain stable.
- Contact flow remains unchanged functionally (Supabase + FormSubmit).
