import { getDb } from '@/app/lib/db';
import { Book, Location } from '@/app/lib/types';
import { BookNotFoundError } from './book.errors';

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