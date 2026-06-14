import { getDb } from '@/app/lib/db';
import { Book, BookLocation, BookRequest, Location } from '@/app/lib/types';
import { BookNotFoundError } from '../errors/book.errors';

type BookDBRow = {
  id: string;
  title: string;
  author: string;
};

const toBook = (row: BookDBRow): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
});

export const getRandomBookByLocation = async (location: Location): Promise<Book> => {
  const result = await getDb().query(
    `
    SELECT b.id, b.title, b.author
    FROM books b
    JOIN book_locations bl ON bl.book_id = b.id
    WHERE bl.location_id = $1
    ORDER BY RANDOM()
    LIMIT 1;
    `, [location.id]
  );

  if (result.rows.length <= 0) throw new BookNotFoundError();
  return toBook(result.rows[0]);
};

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  const result = await getDb().query(
    `
    SELECT b.id, b.title, b.author
    FROM books b
    JOIN book_locations bl ON bl.book_id = b.id
    WHERE bl.location_id = $1;
    `, [locationId]
  );

  return result.rows.map(toBook);
};

export const createBook = async (id: string, bookReq: BookRequest): Promise<Book> => {
  const result = await getDb().query(
    `
    INSERT INTO books (id, title, author)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [id, bookReq.title, bookReq.author]
  );

  return toBook(result.rows[0]);
}

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const result = await getDb().query(
      `
        SELECT id, title, author
        FROM books
        WHERE id = $1
        LIMIT 1;
      `, [id]
    );
    return toBook(result.rows[0]);
  } catch (e) {
    throw new BookNotFoundError();
  }
}

export const deleteBookById = async (id: string) => {
  await getDb().query(
    `
    DELETE FROM books WHERE id = $1;
    `, [id]
  )
}

export const createBookLocation = async (bookLocation: BookLocation) => {
  await getDb().query(
    `
    INSERT INTO book_locations (book_id, location_id)
    VALUES ($1,$2);
    `, [ bookLocation.bookId, bookLocation.locationId ]
  );
}

export const deleteBookLocation = async (bookLocation: BookLocation) => {
  await getDb().query(
    `
    DELETE FROM book_locations
    WHERE book_id = $1 AND location_id = $2;
    `, [ bookLocation.bookId, bookLocation.locationId ]
  );
}

export const queryBooks = async (query: string): Promise<Book[]> => {
  const result = await getDb().query(
    `
    SELECT id, title, author
    FROM books
    WHERE title ILIKE $1 OR author ILIKE $1
    ORDER BY title
    LIMIT 50;
    `, [`%${query}%`]
  );

  return result.rows.map(toBook);
}
