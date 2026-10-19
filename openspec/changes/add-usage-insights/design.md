# Design: Usage events and insights

## Decision
No backend and no third-party analytics. Aggregation is pure functions over the event array so a server can replace the store later.

## Risks
- Keep the change within the 10 minute box; defer extras to a new change
