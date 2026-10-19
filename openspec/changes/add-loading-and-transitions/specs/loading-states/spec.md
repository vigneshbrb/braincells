## ADDED Requirements

### Requirement: Loading
The app SHALL show shimmer skeletons for hero and rows until data is ready.

#### Scenario: Loading case 1
- **WHEN** browse loads
- **THEN** skeletons show for at least 400 ms then fade to content

### Requirement: Route transitions
Navigation SHALL animate between routes with a 250 ms fade and slide.

#### Scenario: Route transitions case 1
- **WHEN** a route changes
- **THEN** outgoing exits before incoming enters
