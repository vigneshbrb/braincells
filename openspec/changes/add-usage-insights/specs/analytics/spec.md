## ADDED Requirements

### Requirement: Event capture
The app SHALL record events with type, title id, profile, region and timestamp in local storage, capped at 5000.

#### Scenario: Event capture case 1
- **WHEN** a title is played
- **THEN** a play event is stored with the active region

### Requirement: Insights
The `/insights` page SHALL show watch time, top genres, completion rate and rating split per region.

#### Scenario: Insights case 1
- **WHEN** events exist for two regions
- **THEN** each region's figures are shown separately
