import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
}));
import * as bookService from './book.service';
import { exampleBook, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation } from "./book.repo";
import type * as BookRepo from "./book.repo"

const mockedRepoGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookRepo.getRandomBookByLocation
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getRandomBookByLocation', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBookByLocation(exampleCountry.code)).toEqual(exampleBook);
  });
});