## ADDED Requirements

### Requirement: Toggle
The app SHALL toggle a title in the active profile's list from any Add control with an animated icon change.

#### Scenario: Toggle case 1
- **WHEN** Add is clicked
- **THEN** the icon morphs to a check and the title is stored

### Requirement: Isolation
Lists SHALL be stored per profile.

#### Scenario: Isolation case 1
- **WHEN** the profile is switched
- **THEN** the other profile's list is shown
