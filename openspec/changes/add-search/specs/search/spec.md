## ADDED Requirements

### Requirement: Search
The app SHALL show matching titles after the user stops typing for 300 ms.

#### Scenario: Search case 1
- **WHEN** 'focus' is typed
- **THEN** titles matching name, genre or synopsis appear

### Requirement: Empty state
The app SHALL show a message and suggestions when nothing matches.

#### Scenario: Empty state case 1
- **WHEN** 'zzzz' is typed
- **THEN** an empty-state message with popular genres is shown
