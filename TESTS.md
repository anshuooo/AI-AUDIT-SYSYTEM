# TESTS

This repository now includes a professional audit engine test suite and CI workflow.

## What is covered

- Savings calculations for optimization recommendations
- Plan downgrade logic for small teams on enterprise tiers
- Optimal plan detection for growing teams
- Enterprise overkill scenarios for oversized licenses
- AI fallback summary when no material savings are found

## Test location

- `server/tests/auditEngine.test.js`

## Run locally

From the repository root:

```bash
cd server
npm install
npm test
npm run lint
```

## GitHub Actions CI

The workflow file is located at:

- `.github/workflows/ci.yml`

CI performs:

- dependency install in `server`
- `npm run lint`
- `npm test`

A failure in linting or tests will cause the workflow to fail safely.
