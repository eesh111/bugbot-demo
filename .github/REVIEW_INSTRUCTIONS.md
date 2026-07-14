# Per-repo review overrides for PR-God / Bugbot
# These are hard overrides for the agent.

## Ignore
- Pure formatting / whitespace-only changes
- Generated lockfile churn without logic changes

## Always flag
- Authz gaps on money-moving or admin endpoints
- Path traversal / unsafe path joins
- Secrets or tokens hardcoded in source
