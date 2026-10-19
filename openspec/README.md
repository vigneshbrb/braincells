# BrainCells: OpenSpec Change Plan

Apply in order, one fresh session each. Target: 10 minutes per change.

| # | Change ID | Capability | Delivers |
|---|---|---|---|
| 1 | `add-project-scaffold` | app-shell | Project scaffold |
| 2 | `add-design-system` | design-system | Design system and motion tokens |
| 3 | `add-catalog-data` | catalog | Catalog data and selectors |
| 4 | `add-sign-in` | auth | Mock sign-in screen |
| 5 | `add-profile-picker` | profiles | Profile picker |
| 6 | `add-app-shell-navbar` | navigation | Navbar and layout |
| 7 | `add-home-hero` | home-hero | Hero billboard |
| 8 | `add-content-rows` | browse-rows | Content rows carousel |
| 9 | `add-title-modal` | title-details | Title detail modal |
| 10 | `add-video-player` | playback | Video player |
| 11 | `add-continue-watching` | watch-history | Continue watching and resume |
| 12 | `add-my-list` | my-list | My List |
| 13 | `add-search` | search | Instant search |
| 14 | `add-top10-row` | top10 | Top 10 row |
| 15 | `add-thumbs-rating` | ratings | Thumbs rating |
| 16 | `add-loading-and-transitions` | loading-states | Skeletons and page transitions |
| 17 | `add-responsive-accessibility` | accessibility | Responsive layout and accessibility |
| 18 | `add-usage-insights` | analytics | Usage events and insights |
| 19 | `add-release-pipeline` | release | Smoke test and deploy |

## Per-change loop
1. `openspec validate <id> --strict`
2. In a fresh AI session: apply `<id>` only (for example `/opsx:apply <id>` or `/openspec:apply <id>`, depending on your installed version)
3. `npm run test && npm run build`, do the manual check, commit
4. `openspec archive <id> --yes`

## Keeping AI cost low
- Proposals and specs are already written, so apply sessions only need `project.md` plus one change folder
- Use the smaller model for apply; run it with tasks as the only plan
- Stop and split a change if it exceeds 10 minutes
