## ADDED Requirements

### Requirement: Choose profile
The app SHALL show saved profiles and let the user select one to continue to `/browse`.

#### Scenario: Choose profile case 1
- **WHEN** a profile is clicked
- **THEN** it becomes active and `/browse` opens

### Requirement: Manage profiles
The app SHALL allow adding profiles up to a maximum of five and deleting any profile except the last.

#### Scenario: Manage profiles case 1
- **WHEN** five profiles exist
- **THEN** the add tile is hidden

#### Scenario: Manage profiles case 2
- **WHEN** one profile remains
- **THEN** delete is disabled
