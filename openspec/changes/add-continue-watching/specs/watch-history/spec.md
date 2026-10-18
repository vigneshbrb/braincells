## ADDED Requirements

### Requirement: Save progress
The player SHALL store position and duration for the active profile and title every 5 seconds during playback and on pause.

#### Scenario: Periodic save
- **WHEN** a title plays for 30 seconds
- **THEN** its position and duration are saved for the active profile and title

#### Scenario: Pause before the next save
- **WHEN** the user pauses a title before the next 5-second save
- **THEN** its current position and duration are saved

#### Scenario: Separate profile history
- **WHEN** two profiles watch the same title to different positions
- **THEN** each profile retains its own saved position

### Requirement: Resume
The app SHALL resume a title at its saved position without seeking back during continued playback, and remove it from Continue Watching at or beyond 95 percent.

#### Scenario: Resume saved position
- **WHEN** the user reopens a title saved at 40 percent and its video metadata loads
- **THEN** playback starts at the saved position and subsequent progress saves do not seek it backward

#### Scenario: Continue Watching progress
- **WHEN** a title is saved at 40 percent for the active profile
- **THEN** it appears in Continue Watching with a 40 percent bar

#### Scenario: Completed title
- **WHEN** a title reaches 95 percent playback
- **THEN** it is removed from the row
