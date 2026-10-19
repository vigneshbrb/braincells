## ADDED Requirements

### Requirement: Rate
The app SHALL let the user set or clear a rating of down, up or double up for a title.

#### Scenario: Rate case 1
- **WHEN** thumbs up is clicked twice
- **THEN** the rating is cleared

### Requirement: Persistence
Ratings SHALL persist per profile.

#### Scenario: Persistence case 1
- **WHEN** the page is reloaded
- **THEN** the rating is still shown
