# Change: Smoke test and deploy

## Why
Ship the working app.

## What Changes
- Playwright smoke: sign in, pick profile, play, add to list
- GitHub Actions: test, build, deploy to static hosting
- README with run and deploy steps

## Impact
- Affected specs: release
- Time box: 10 minutes to build, test and ship
- Depends on: previous changes in `README.md` order
