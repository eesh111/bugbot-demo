# Review instructions (bugbot-demo)

Hard overrides for PR-God.

## Ignore
- Pure formatting / whitespace-only changes
- Generated lockfile churn without logic changes

## Always flag
- Authz gaps on money-moving or admin endpoints
- Path traversal / unsafe path joins
- Hardcoded secrets or tokens in source
- Eval / dynamic code execution of client input
- Prototype pollution / mass assignment
