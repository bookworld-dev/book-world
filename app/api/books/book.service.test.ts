import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.repo', () => ({
  getRandomBook: vi.fn(),
}));
import * as bookService from './book.service';
import { exampleBook } from "../../__tests__/fixtures";
import { getRandomBook } from "./book.repo";
import type * as BookRepo from "./book.repo"

const mockedRepoGetRandomBook =
  getRandomBook as MockedFunction<
    typeof BookRepo.getRandomBook
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getRandomBook', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBook()).toEqual(exampleBook);
  });
});