import { getDb } from '@/app/lib/db';
import { Book } from '@/app/lib/types';

type BookDBResult = {
  id: number;
  title: string;
  author: string;
  country: string;
  cover_url: string;
};

const mapToBook = (bookDBResult: BookDBResult): Book => {
  return {
    id: bookDBResult.id.toString(),
    title: bookDBResult.title,
    author: bookDBResult.author,
    country: bookDBResult.country,
    coverUrl: bookDBResult.cover_url
  }
}

export const getRandomBook = async (): Promise<Book> => {
  const result = await getDb().query(
    `SELECT id, title, author, country, cover_url
     FROM books
     ORDER BY random()
     LIMIT 1`
  );

  return mapToBook(result.rows[0]);
};