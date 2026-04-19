# Auralith Stack

Auralith Stack is a practical app stack for shipping polished React projects quickly.

- CLI scaffolding: `create-auralith-app`
- Curated templates (`landing`, `dashboard`)
- Consistent folder conventions
- Auralith UI integrated by default
- Deploy recipes for GitHub Pages and Vercel

## Quickstart

```bash
npx create-auralith-app my-app --template landing
cd my-app
npm run dev
```

For a dashboard starter:

```bash
npx create-auralith-app my-dashboard --template dashboard
```

## Folder map

```text
auralith-stack/
  packages/
    create-auralith-app/
  templates/
    landing/
    dashboard/
  docs/
```

## Local CLI development

```bash
cd packages/create-auralith-app
npm install
npm run build
node dist/index.js my-app --template landing --skip-prompts --no-install --no-git
```

## CLI options

```text
--template <landing|dashboard>
--package-manager <npm|pnpm>
--install / --no-install
--git / --no-git
--skip-prompts
--help
```

## Command examples

```bash
# scaffold dashboard with pnpm and skip interactive questions
npx create-auralith-app acme-control --template dashboard --package-manager pnpm --skip-prompts

# scaffold landing without dependency install
npx create-auralith-app brand-site --template landing --no-install --skip-prompts
```

## Template previews

- `landing`: marketing-first layout with hero, feature sections, PT/EN switch, theme modes, and contact flow.
- `dashboard`: app-shell layout with navigation, analytics cards, table/list placeholders, PT/EN switch, theme modes, and contact flow.

Both templates include:

- Supabase primary contact submit path
- FormSubmit token/email mirror fallback
- GitHub Pages workflow via `gh-pages` branch
- Vercel deploy recipe with required `VITE_*` variables

## Documentation

- `CHANGELOG.md`
- `CHANGELOG.pt-BR.md`
- `docs/getting-started.md`
- `docs/conventions.md`
- `docs/design-spec-v0.2.md`
- `docs/deploy/github-pages.md`
- `docs/deploy/vercel.md`
- `docs/milestone-3-issues.md`
- `docs/milestone-3-release-notes.md`
- `docs/release-v0.1.3.md`
