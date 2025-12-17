import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
vi.mock('../book.controller', () => ({
  getRandomBook: vi.fn(),
}));
import * as bookRoutes from './route';
import { getRandomBook } from '../book.controller';
import type * as BookController from '../book.controller';
import { exampleBook } from '../../../__tests__/fixtures';

const mockedControllerGetRandomBook =
  getRandomBook as MockedFunction<
    typeof BookController.getRandomBook
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/books/random', async () => {
  it('gets a random book', async () => {
    mockedControllerGetRandomBook.mockResolvedValue(exampleBook);
    const res = await bookRoutes.GET();
    expect(await res.json()).toEqual(exampleBook);
  });
});