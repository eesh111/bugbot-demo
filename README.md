# Bugbot Demo

A minimal Node.js ESM checkout service used to exercise automated PR review tooling.

## Setup

```bash
npm install
npm test
npm start
```

## Branches

- `main` — baseline with basic checkout flow and tests
- `feature/buggy-checkout` — introduces intentional logic, security, and authorization bugs for review demos
