# Design: Title detail modal

## Decision
Use Framer Motion `layoutId` keyed by title id between `PosterCard` and `TitleModal`. Fallback to fade-scale when the card is off screen.

## Risks
- Keep the change within the 10 minute box; defer extras to a new change
