import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocation: vi.fn()
}));
import * as bookService from './book.service';
import { exampleBook, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocation } from "./book.repo";
import * as BookRepo from "./book.repo"

const mockedRepoGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookRepo.getRandomBookByLocation
  >;

const mockedRepoGetBooksByLocation =
  getBooksByLocation as MockedFunction<
    typeof BookRepo.getBooksByLocation
  >;

describe('getRandomBookByLocation', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBookByLocation(exampleCountry.code)).toEqual(exampleBook);
  });
});

describe('getBooksByLocation', async () => {
  it('gets all books for location', async () => {
    const books = [ exampleBook ];
    mockedRepoGetBooksByLocation.mockResolvedValue(books);
    expect(await bookService.getBooksByLocation(exampleCountry)).toEqual(books);
  });
});