## ADDED Requirements

### Requirement: Theme tokens
The app SHALL expose color, type and radius tokens as CSS variables used by all components.

#### Scenario: Theme tokens case 1
- **WHEN** a component uses `var(--accent)`
- **THEN** it renders the accent color from `project.md`

### Requirement: Reduced motion
Motion presets SHALL resolve to instant transitions when `prefers-reduced-motion` is set.

#### Scenario: Reduced motion case 1
- **WHEN** reduced motion is enabled
- **THEN** `useMotion()` returns zero-duration transitions
