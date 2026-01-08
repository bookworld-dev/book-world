import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocation: vi.fn(),
  createBook: vi.fn()
}));
import * as bookService from './book.service';
import { exampleBook, exampleBookReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocation, createBook } from "./book.repo";
import * as BookRepo from "./book.repo";

const mockedRepoGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookRepo.getRandomBookByLocation
  >;

const mockedRepoGetBooksByLocation =
  getBooksByLocation as MockedFunction<
    typeof BookRepo.getBooksByLocation
  >;

const mockedRepoCreateBook =
  createBook as MockedFunction<
    typeof BookRepo.createBook
  >;

describe('getRandomBookByLocation', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBookByLocation(exampleCountry)).toEqual(exampleBook);
  });
});

describe('getBooksByLocation', async () => {
  it('gets all books for location', async () => {
    const books = [exampleBook];
    mockedRepoGetBooksByLocation.mockResolvedValue(books);
    expect(await bookService.getBooksByLocation(exampleCountry)).toEqual(books);
  });
});

describe('createBook', async () => {
  it('creates a book with book repo', async () => {
    mockedRepoCreateBook.mockResolvedValue(exampleBook);
    expect(await bookService.createBook(exampleBookReq)).toEqual(exampleBook);
  });
});