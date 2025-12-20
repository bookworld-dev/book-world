CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  country TEXT NOT NULL,
  cover_url TEXT
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL
    CHECK (level IN ('country', 'state')),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id BIGINT
    REFERENCES locations(id)
    ON DELETE RESTRICT,
  CONSTRAINT country_has_no_parent
    CHECK (
      (level = 'country' AND parent_id IS NULL)
      OR
      (level = 'state' AND parent_id IS NOT NULL)
    )
);