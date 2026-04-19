# Auralith Stack

Auralith Stack is a practical app stack for shipping polished React projects quickly.

- CLI scaffolding: `create-auralith-app`
- Curated templates (`landing`, `dashboard`)
- Consistent folder conventions
- Auralith UI integrated by default
- Deploy recipes for GitHub Pages and Vercel

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

## Documentation

- `docs/getting-started.md`
- `docs/conventions.md`
- `docs/deploy/github-pages.md`
- `docs/deploy/vercel.md`
