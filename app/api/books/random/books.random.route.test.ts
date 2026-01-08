import { describe, it, expect, vi, MockedFunction } from 'vitest';
vi.mock('../book.controller', () => ({
  getRandomBookByLocationCode: vi.fn(),
}));
import * as bookRoutes from './route';
import { getRandomBookByLocationCode } from '../book.controller';
import type * as BookController from '../book.controller';
import { exampleBook, exampleCountry } from '../../../__tests__/fixtures';
import { NextRequest } from 'next/server';

const mockedBookControllerGetRandomBookByLocation =
  getRandomBookByLocationCode as MockedFunction<
    typeof BookController.getRandomBookByLocationCode
  >;

describe('/api/books/random', async () => {
  it('gets a random book', async () => {
    mockedBookControllerGetRandomBookByLocation.mockResolvedValue(exampleBook);
    const res = await bookRoutes.GET(new NextRequest(`http://localhost/api/books/random?country=${exampleCountry.code}`));
    expect(await res.json()).toEqual(exampleBook);
  });
});