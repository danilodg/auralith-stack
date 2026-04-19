# Getting Started

## 1) Scaffold a project

Use the CLI to scaffold a project:

```bash
npx create-auralith-app my-app --template landing
```

## 2) Run locally

```bash
cd my-app
npm run dev
```

## 3) Configure contact env variables

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_CONTACT_FUNCTION`
- `VITE_CONTACT_EMAIL`
- `VITE_FORMSUBMIT_TOKEN`

## 4) Build for production

```bash
npm run build
```

## 5) Deploy

- GitHub Pages recipe: `docs/deploy/github-pages.md`
- Vercel recipe: `docs/deploy/vercel.md`
