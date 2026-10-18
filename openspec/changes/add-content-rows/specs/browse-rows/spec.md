## ADDED Requirements

### Requirement: Row scrolling
A row SHALL scroll horizontally by one page per arrow click and by touch swipe.

#### Scenario: Row scrolling case 1
- **WHEN** the right arrow is clicked
- **THEN** the row scrolls by one visible page smoothly

#### Scenario: Row scrolling case 2
- **WHEN** the row is at its start
- **THEN** the left arrow is hidden

### Requirement: Card hover
A card SHALL scale and reveal quick actions after hovering for 300 ms.

#### Scenario: Card hover case 1
- **WHEN** a card is hovered 300 ms
- **THEN** it scales to 1.15 and shows Play and Add actions
