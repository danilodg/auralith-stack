# Deploy Recipe - Vercel (SPA)

This recipe applies to generated Auralith Stack apps using Vite.

## 1) Import project

- In Vercel, click `Add New -> Project`.
- Import your GitHub repository.

## 2) Build settings

Vercel usually detects Vite automatically.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## 3) Environment variables

Add these variables in Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_CONTACT_FUNCTION`
- `VITE_CONTACT_EMAIL`
- `VITE_FORMSUBMIT_TOKEN`

Important:

- Frontend `VITE_*` variables are public in built assets.
- Never expose service-role keys.

## 4) Deploy

- Click `Deploy`.
- Wait for build and publish completion.

## 5) Validate

- Open deployed domain.
- Verify theme + language toggles.
- Submit contact form:
  - check Supabase lead insertion
  - verify fallback email flow if used

## Optional: custom domain

- Add your domain under `Project -> Settings -> Domains`.
- Follow DNS instructions from Vercel.
