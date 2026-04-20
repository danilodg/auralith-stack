# create-auralith-app

CLI to scaffold Auralith Stack starter projects with consistent defaults.

## Quickstart

```bash
npx create-auralith-app my-app --template landing
cd my-app
npm run dev
```

Dashboard starter:

```bash
npx create-auralith-app my-dashboard --template dashboard
```

## Templates

- `landing`: marketing-first layout with sections, language/theme controls, and contact flow.
- `dashboard`: app-shell layout with navigation, stats/table placeholders, and contact flow.

Both templates include:

- Auralith UI pre-integrated
- Supabase-first contact submit path
- FormSubmit fallback strategy
- GitHub Pages workflow (`gh-pages`)
- Vercel deploy recipe (`VITE_*` envs)

## CLI options

```text
--template <landing|dashboard>
--package-manager <npm|pnpm>
--install / --no-install
--git / --no-git
--skip-prompts
--help
```

## Common examples

```bash
# scaffold dashboard with pnpm and skip interactive prompts
npx create-auralith-app acme-control --template dashboard --package-manager pnpm --skip-prompts

# scaffold landing without dependency installation
npx create-auralith-app brand-site --template landing --no-install --skip-prompts
```

## Local development

```bash
npm install
npm run build
node dist/index.js my-app --template landing --skip-prompts --no-install --no-git
```

## Repository

- Source: https://github.com/danilodg/auralith-stack
