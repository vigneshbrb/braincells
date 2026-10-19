## ADDED Requirements

### Requirement: Smoke test
The repository SHALL include an end-to-end test covering sign in, profile select, play and add to list.

#### Scenario: Smoke test case 1
- **WHEN** `npm run e2e` is run
- **THEN** all steps pass

### Requirement: Deploy
Pushing to main SHALL build and publish the static site after tests pass.

#### Scenario: Deploy case 1
- **WHEN** main is pushed with failing tests
- **THEN** no deploy occurs
