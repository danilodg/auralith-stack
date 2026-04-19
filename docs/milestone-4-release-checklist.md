# Milestone 4 - Release Checklist (ISSUE-014 / ISSUE-015)

Date: 2026-04-19

## ISSUE-014 - Publish npm package `create-auralith-app`

### Pre-publish

- [x] CLI builds successfully (`npm run build`)
- [x] CLI help output is correct (`node dist/index.js --help`)
- [x] Confirm npm account access (`npm whoami`)
- [x] Confirm package name availability/version strategy
- [x] Update version (if needed) in `packages/create-auralith-app/package.json`

### Publish

- [x] Login to npm (if not already logged in)
- [x] Publish from `packages/create-auralith-app` using `npm publish --access public`
- [x] Verify package availability on npm registry

### Verify install path

- [x] Run `npx create-auralith-app --help` from outside this repository
- [x] Confirm binary resolves and executes correctly

## ISSUE-015 - Dogfood and validation pass

### Generate apps from published CLI

- [x] Generate landing app via `npx create-auralith-app smoke-release-landing --template landing --skip-prompts`
- [x] Generate dashboard app via `npx create-auralith-app smoke-release-dashboard --template dashboard --skip-prompts`

### Validate both generated apps

- [x] In landing app: run `npm run dev` and `npm run build`
- [x] In dashboard app: run `npm run dev` and `npm run build`
- [x] Confirm contact env keys exist in `.env.example`
- [x] Confirm deploy workflow file exists in `.github/workflows/deploy-pages.yml`

### Done criteria

- [x] Both generated apps work without manual code patches
- [x] Validation notes captured in release notes/changelog

## Validation notes

- Published `create-auralith-app` versions: `0.1.0`, `0.1.1`, `0.1.2`, `0.1.3`.
- Final validated release is `0.1.3`.
- Packaging was corrected to include only `dist` + `templates` and to resolve templates both in monorepo and published package mode.
- Dogfood apps generated in `/tmp/auralith-release-smoke` from `create-auralith-app@0.1.3` passed `dev` startup and `build` in both templates.

## Suggested execution commands

```bash
cd packages/create-auralith-app
npm whoami
npm publish --access public

mkdir -p /tmp/auralith-release-smoke && cd /tmp/auralith-release-smoke
npx create-auralith-app smoke-release-landing --template landing --skip-prompts
npx create-auralith-app smoke-release-dashboard --template dashboard --skip-prompts

cd smoke-release-landing && npm run build
cd ../smoke-release-dashboard && npm run build
```
