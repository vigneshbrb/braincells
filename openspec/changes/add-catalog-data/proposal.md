# Change: Catalog data and selectors

## Why
All browse screens read from one typed catalog.

## What Changes
- `catalog.json` with 30 original titles, 6 genres
- Types `Title`, `Genre`; selectors `byGenre`, `byId`, `featured`
- Poster gradient generator from title seed

## Impact
- Affected specs: catalog
- Time box: 10 minutes to build, test and ship
- Depends on: previous changes in `README.md` order
