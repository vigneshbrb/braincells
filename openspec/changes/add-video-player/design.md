# Design: Video player

## Decision
Wrap `HTMLVideoElement` in a `usePlayer` hook exposing state; controls are pure components so they can be tested without media.

## Risks
- Keep the change within the 10 minute box; defer extras to a new change
