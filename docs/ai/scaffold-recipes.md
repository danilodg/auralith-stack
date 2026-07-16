# Scaffold Recipes

Recipes for AI agents creating projects with Auralith Stack.

## Create a Landing App

Use this for marketing or public content.

```bash
npx create-auralith-app my-landing --template landing --package-manager npm --skip-prompts
cd my-landing
npm run build
```

After scaffolding:

- Review brand text and CTA copy.
- Configure contact submit path.
- Verify theme switch.
- Verify responsive layout.
- Keep Auralith UI imports; do not recreate primitives.

## Create a Dashboard App

Use this for app shells and data-heavy products.

```bash
npx create-auralith-app my-dashboard --template dashboard --package-manager npm --skip-prompts
cd my-dashboard
npm run build
```

After scaffolding:

- Replace placeholder data with domain data.
- Configure navigation items.
- Configure tables/lists.
- Add authenticated routes when needed.
- Use `DataTable`, `TableToolbar`, `DropdownMenu`, `Modal`, and `AlertDialog` from Auralith UI.

## Local Development Smoke Test

From the Auralith Stack repository:

```bash
cd packages/create-auralith-app
npm run build
```

Then from the repository root:

```bash
node packages/create-auralith-app/dist/index.js smoke-landing --template landing --skip-prompts --no-install --no-git
node packages/create-auralith-app/dist/index.js smoke-dashboard --template dashboard --skip-prompts --no-install --no-git
```

## Existing App Integration

Do not use the scaffolder if the user already has an app and asks to improve UI.

Use:

```bash
npm install auralith-ui
```

Then import styles once:

```ts
import 'auralith-ui/styles.css'
```

Follow the Auralith UI AI docs for component choices.

## Deployment Notes

For GitHub Pages, verify base path behavior and generated workflow settings.

For Vercel, verify required `VITE_*` variables described in deploy docs.

Do not hardcode production URLs in templates unless explicitly required.
