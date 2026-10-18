## ADDED Requirements

### Requirement: Open and close
The app SHALL open a detail modal for a title with an expand animation from its card, and close on Esc, backdrop or close button.

#### Scenario: Open and close case 1
- **WHEN** Esc is pressed
- **THEN** the modal collapses and focus returns to the card

### Requirement: More like this
The modal SHALL list up to 6 titles sharing a genre with the current one.

#### Scenario: More like this case 1
- **WHEN** a Focus title is open
- **THEN** only other Focus titles are listed, excluding itself
