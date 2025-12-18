CREATE TABLE IF NOT EXISTS books (
  id SERIAl PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  country TEXT NOT NULL,
  cover_url TEXT
);