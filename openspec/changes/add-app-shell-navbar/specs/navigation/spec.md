## ADDED Requirements

### Requirement: Scroll state
The navbar SHALL transition from transparent to a blurred solid background after the page scrolls 40px.

#### Scenario: Scroll state case 1
- **WHEN** the page scrolls past 40px
- **THEN** the navbar background fades in within 250 ms

### Requirement: Profile menu
The navbar SHALL provide a menu to switch profile or sign out.

#### Scenario: Profile menu case 1
- **WHEN** sign out is chosen
- **THEN** auth is cleared and `/signin` opens
