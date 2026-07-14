# bugbot-demo

Demo storefront for **[PR-God](https://github.com/eesh111/pr-god)** live reviews.

`main` is the clean-ish baseline. Feature branches plant security and logic bugs on purpose.

## Run locally

```bash
npm install
npm test
npm start
```

## Live demo of PR-God

1. Open the latest demo PR on GitHub (Conversation / Files tabs).
2. In Cursor with the `pr-god` MCP configured, run:

```text
/pr-god eesh111/bugbot-demo #<pr-number>
```

3. Watch the agent call MCP tools, then refresh the PR — a **COMMENT** review with inline notes should appear.

## What’s in the app

HTTP JSON API covering products, cart, checkout, users, refunds, receipts, shipping quotes, analytics, admin, and payment webhooks — enough surface area for a real review pass.
