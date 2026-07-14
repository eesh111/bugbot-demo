# bugbot-demo

Tiny Node checkout service used to demo **PR-God** reviews.

## Setup

```bash
npm install
npm test
npm start
```

## Branches

- `main` — clean baseline
- `feature/buggy-checkout` — intentional bugs for review demos

## Review with PR-God

1. Install and configure the [`pr-god`](https://github.com/eesh111/pr-god) MCP in Cursor.
2. Run:

```text
/pr-god eesh111/bugbot-demo #1
```

Cursor’s agent reviews the PR and posts a `COMMENT` review via the local MCP.
