## ADDED Requirements

### Requirement: Application boots
The app SHALL render a root layout with a router outlet and a 404 route.

#### Scenario: Application boots case 1
- **WHEN** the app starts at `/`
- **THEN** the user is redirected to `/signin`

#### Scenario: Application boots case 2
- **WHEN** an unknown path is opened
- **THEN** a not-found screen with a link home is shown

### Requirement: Test tooling
The repo SHALL provide `npm run test`, `npm run build` and `npm run e2e` scripts.

#### Scenario: Test tooling case 1
- **WHEN** `npm run test` is run on a fresh clone
- **THEN** it exits 0 with at least one passing test
