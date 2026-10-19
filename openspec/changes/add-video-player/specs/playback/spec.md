## ADDED Requirements

### Requirement: Controls
The player SHALL provide play and pause, seek, volume, mute, fullscreen and skip of 10 seconds.

#### Scenario: Controls case 1
- **WHEN** space is pressed
- **THEN** playback toggles

### Requirement: Auto-hide
The player SHALL hide controls after 3 seconds without pointer movement and show them on movement.

#### Scenario: Auto-hide case 1
- **WHEN** 3 seconds pass idle
- **THEN** controls fade out and the cursor hides
