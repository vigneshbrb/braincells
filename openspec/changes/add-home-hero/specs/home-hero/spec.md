## ADDED Requirements

### Requirement: Billboard
The home page SHALL show a hero for a featured title with name, synopsis, Play and More Info actions.

#### Scenario: Billboard case 1
- **WHEN** the home page loads
- **THEN** the hero poster is visible and the title text animates in

### Requirement: Trailer autoplay
The hero SHALL play its trailer muted after 1.5 seconds and fade from poster to video.

#### Scenario: Trailer autoplay case 1
- **WHEN** 1.5 seconds pass
- **THEN** the video plays and the poster fades out

#### Scenario: Trailer autoplay case 2
- **WHEN** reduced motion is set
- **THEN** the video does not autoplay
