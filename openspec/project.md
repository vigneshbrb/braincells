# BrainCells: Project Context

## Purpose
BrainCells is a Netflix-style streaming web app for personal development. Static front end, no backend, no paid APIs.

## Tech Stack
- Vite + React 18 + TypeScript (strict)
- Tailwind CSS with design tokens as CSS variables
- Framer Motion for all animation
- Zustand with `persist` (localStorage) for auth, profiles, list, progress, ratings, events
- React Router v6
- Vitest + Testing Library (unit), Playwright (one smoke suite)
- Video: HTML5 `<video>` with public sample MP4s; posters are generated CSS gradients (no image downloads)

## Conventions
- One capability per change; one change per session; each change fits a 10 minute build, test and ship
- Files under 150 lines; components in `src/components/<Name>/`, stores in `src/store/`
- Every component ships with one test file covering its scenarios
- No new dependency unless the change's proposal names it

## Design Tokens (defined in `add-design-system`)
- Background `#0B0B12`, surface `#14141F`, text `#F5F5FA`, muted `#9A9AB0`, accent `#8B5CF6`, highlight `#FF7A59`
- Font: "Plus Jakarta Sans" (body, UI), "Sora" (display)

## Motion Budget
- Durations 150 ms (micro), 250 ms (UI), 450 ms (hero, modal); easing `cubic-bezier(.2,.8,.2,1)`
- Animate transform and opacity only; honor `prefers-reduced-motion`
- No animation may block input

## Definition of Done (per change)
1. `npm run test` passes  2. `npm run build` passes  3. `openspec validate <id> --strict` passes
4. Manual check from the change's tasks done  5. Commit `feat(<id>)`, then `openspec archive <id> --yes`

## AI Cost Rules
- Apply one change per fresh session; give the model only that change folder plus `project.md`
- Use the smaller model for apply; use the larger one only to write or fix proposals
- Do not paste files; reference paths. Ask for diffs, not full rewrites
