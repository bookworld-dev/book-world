CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL
    CHECK (level IN ('country', 'state')),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id UUID
    REFERENCES locations(id)
    ON DELETE RESTRICT,
  CONSTRAINT country_has_no_parent
    CHECK (
      (level = 'country' AND parent_id IS NULL)
      OR
      (level = 'state' AND parent_id IS NOT NULL)
    )
);

CREATE TABLE book_locations (
  book_id UUID NOT NULL,
  location_id UUID NOT NULL,

  PRIMARY KEY (book_id, location_id),

  CONSTRAINT fk_book
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_location
    FOREIGN KEY (location_id)
    REFERENCES locations(id)
    ON DELETE CASCADE
);