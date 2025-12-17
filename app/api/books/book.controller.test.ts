import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.service', () => ({
  getRandomBook: vi.fn(),
}));
import * as bookController from './book.controller';
import { exampleBook } from "../../__tests__/fixtures";
import { getRandomBook } from "./book.service";
import type * as BookService from "./book.service"

const mockedServiceGetRandomBook =
  getRandomBook as MockedFunction<
    typeof BookService.getRandomBook
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getRandomBook', async () => {
  it('gets random book from service', async () => {
    mockedServiceGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookController.getRandomBook()).toEqual(exampleBook);
  });
});