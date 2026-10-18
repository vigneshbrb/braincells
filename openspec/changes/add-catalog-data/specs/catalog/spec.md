## ADDED Requirements

### Requirement: Catalog schema
Each title SHALL have id, name, year, maturity, genres, synopsis, duration, trailerUrl and a poster seed.

#### Scenario: Catalog schema case 1
- **WHEN** the catalog is loaded
- **THEN** every title passes schema validation

### Requirement: Selectors
The catalog module SHALL provide lookup by id, genre and featured flag.

#### Scenario: Selectors case 1
- **WHEN** `byGenre('Focus')` is called
- **THEN** only titles tagged Focus are returned
