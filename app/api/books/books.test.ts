import { describe, expect, it } from 'vitest';
import { exampleBook } from '../../__tests__/fixtures';
import { GET } from './random/route';
import { insertBook } from '../../__tests__/helpers';

describe('GET /api/books/random', async () => {
  it('gets a random book', async () => {
    await insertBook(exampleBook);
    expect(await (await GET()).json()).toEqual(exampleBook);
  });
});