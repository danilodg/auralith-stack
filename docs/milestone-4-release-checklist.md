# Milestone 4 - Release Checklist (ISSUE-014 / ISSUE-015)

Date: 2026-04-19

## ISSUE-014 - Publish npm package `create-auralith-app`

### Pre-publish

- [x] CLI builds successfully (`npm run build`)
- [x] CLI help output is correct (`node dist/index.js --help`)
- [ ] Confirm npm account access (`npm whoami`)
- [ ] Confirm package name availability/version strategy
- [ ] Update version (if needed) in `packages/create-auralith-app/package.json`

### Publish

- [ ] Login to npm (if not already logged in)
- [ ] Publish from `packages/create-auralith-app` using `npm publish --access public`
- [ ] Verify package availability on npm registry

### Verify install path

- [ ] Run `npx create-auralith-app --help` from outside this repository
- [ ] Confirm binary resolves and executes correctly

## ISSUE-015 - Dogfood and validation pass

### Generate apps from published CLI

- [ ] Generate landing app via `npx create-auralith-app smoke-release-landing --template landing --skip-prompts`
- [ ] Generate dashboard app via `npx create-auralith-app smoke-release-dashboard --template dashboard --skip-prompts`

### Validate both generated apps

- [ ] In landing app: run `npm run dev` and `npm run build`
- [ ] In dashboard app: run `npm run dev` and `npm run build`
- [ ] Confirm contact env keys exist in `.env.example`
- [ ] Confirm deploy workflow file exists in `.github/workflows/deploy-pages.yml`

### Done criteria

- [ ] Both generated apps work without manual code patches
- [ ] Validation notes captured in release notes/changelog

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
