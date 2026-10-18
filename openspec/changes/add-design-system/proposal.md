# Change: Design system and motion tokens

## Why
A consistent look and motion language keeps later changes small.

## What Changes
- CSS variables for color, spacing, radius, shadow
- Fonts, Button, IconButton, Badge primitives
- `motion.ts` presets: fadeUp, scaleIn, stagger; reduced-motion hook

## Impact
- Affected specs: design-system
- Time box: 10 minutes to build, test and ship
- Depends on: previous changes in `README.md` order
