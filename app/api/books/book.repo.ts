import { getDb } from '@/app/lib/db';
import { Book } from '@/app/lib/types';
import { BookNotFoundError } from './book.errors';

type BookDBRow = {
  id: number;
  title: string;
  author: string;
  country: string;
  cover_url: string;
};

const toBook = (row: BookDBRow): Book => {
  return {
    id: row.id.toString(),
    title: row.title,
    author: row.author,
    country: row.country,
    coverUrl: row.cover_url
  }
}

export const getRandomBook = async (): Promise<Book> => {
  const result = await getDb().query(
    `SELECT id, title, author, country, cover_url
     FROM books
     ORDER BY random()
     LIMIT 1`
  );

  if (result.rows.length <= 0) throw new BookNotFoundError();
  return toBook(result.rows[0]);
};