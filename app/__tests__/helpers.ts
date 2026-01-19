import { Book, BookRequest, Location, LocationRequest } from "../lib/types";
import { getTestPool } from "./setup/testDB.setup";

export const insertBook = async (bookReq: BookRequest): Promise<Book> => {
  const pool = getTestPool();

  const result = await pool.query(
    `
    INSERT INTO books (title, author, cover_url)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [
      bookReq.title,
      bookReq.author,
      bookReq.coverUrl,
    ]
  );

  return { id: result.rows[0].id, ... bookReq }
};

export const insertLocation = async (locationReq: LocationRequest, parentId: string | null): Promise<Location> => {
  const pool = getTestPool();

  const result = await pool.query(
    `
    INSERT INTO locations (level, code, name, parent_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [
      locationReq.level,
      locationReq.code,
      locationReq.name,
      parentId,
    ]
  );
  return { id: result.rows[0].id, ... locationReq, parentId }
};

export const insertBookLocation = async (book: Book, location: Location) => {
  const pool = getTestPool();
  await pool.query(
    `
    INSERT INTO book_locations (book_id, location_id)
    VALUES ($1, $2)
    `,
    [
      book.id,
      location.id
    ]
  );

}