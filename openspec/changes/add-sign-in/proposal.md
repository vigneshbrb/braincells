# Change: Mock sign-in screen

## Why
A branded entry point sets the experience.

## What Changes
- Email and password form, validation, animated error shake
- Auth store persisted locally; any valid-looking email accepted
- Route guard for `/browse` and `/watch`

## Impact
- Affected specs: auth
- Time box: 10 minutes to build, test and ship
- Depends on: previous changes in `README.md` order
