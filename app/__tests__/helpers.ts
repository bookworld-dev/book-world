import { Book, Location } from "../lib/types";
import { getTestPool } from "./setup/testDB.setup";

export const insertBook = async (book: Book) => {
  const pool = getTestPool();

  await pool.query(
    `
    INSERT INTO books (title, author, country, cover_url)
    VALUES ($1, $2, $3, $4)
    `,
    [
      book.title,
      book.author,
      book.country,
      book.coverUrl,
    ]
  );
};



export const insertLocation = async (location: Location) => {
  const pool = getTestPool();

  await pool.query(
    `
    INSERT INTO locations (level, code, name, parent_id)
    VALUES ($1, $2, $3, $4)
    `,
    [
      location.level,
      location.code,
      location.name,
      location.parentId,
    ]
  );
};