## ADDED Requirements

### Requirement: Sign in
The app SHALL let a user sign in with a valid email and a password of at least 6 characters.

#### Scenario: Sign in case 1
- **WHEN** valid credentials are submitted
- **THEN** the user is stored as signed in and sent to `/profiles`

#### Scenario: Sign in case 2
- **WHEN** an invalid email is submitted
- **THEN** an inline error is shown with a shake animation and no navigation

### Requirement: Route guard
Protected routes SHALL redirect signed-out users to `/signin`.

#### Scenario: Route guard case 1
- **WHEN** a signed-out user opens `/browse`
- **THEN** they are redirected to `/signin`
