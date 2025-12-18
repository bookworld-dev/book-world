import { describe, expect, it } from 'vitest';
import { exampleBook } from '../__tests__/fixtures';
import { getTestPool } from '../__tests__/setup/testDB.setup';
import { Book } from '../lib/types';
import { GET } from './books/random/route';

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

describe('GET /api/books/random', async () => {
  it('gets a random book', async () => {
    await insertBook(exampleBook);
    expect(await (await GET()).json()).toEqual(exampleBook);
  });
});