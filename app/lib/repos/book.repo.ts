import { getDb } from '@/app/lib/db';
import { Book, BookLocation, BookRequest, Location } from '@/app/lib/types';
import { BookNotFoundError } from '../errors/book.errors';

type BookDBRow = {
  id: number;
  title: string;
  author: string;
  cover_url: string;
};

const toBook = (row: BookDBRow): Book => {
  return {
    id: row.id.toString(),
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url
  }
}

export const getRandomBookByLocation = async (location: Location): Promise<Book> => {
  const result = await getDb().query(
    `
    SELECT b.id, b.title, b.author, b.cover_url
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

export const getBooksByLocation = async (location: Location): Promise<Book[]> => {
  const result = await getDb().query(
    `
    SELECT b.id, b.title, b.author, b.cover_url
    FROM books b
    JOIN book_locations bl ON bl.book_id = b.id
    WHERE bl.location_id = $1;
    `, [location.id]
  );

  return result.rows.map(toBook);
};

export const createBook = async (bookReq: BookRequest): Promise<Book> => {
  const result = await getDb().query(
    `
    INSERT INTO books (title, author, cover_url)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [bookReq.title, bookReq.author, bookReq.coverUrl]
  );

  return toBook(result.rows[0]);
}

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const result = await getDb().query(
      `
        SELECT id, title, author, cover_url
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