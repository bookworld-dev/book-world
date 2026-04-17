import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../repos/book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocationId: vi.fn(),
  createBook: vi.fn(),
  getBookById: vi.fn(),
  deleteBookById: vi.fn(),
  createBookLocation: vi.fn(),
  deleteBookLocation: vi.fn(),
  queryBooks: vi.fn()
}));
vi.mock('./location.service', () => ({
  getLocationByCode: vi.fn()
}));
import * as bookService from '../services/book.service';
import { exampleBook, exampleBookReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocationId, createBook, getBookById, deleteBookById, createBookLocation, deleteBookLocation, queryBooks } from "../repos/book.repo";
import * as BookRepo from "../repos/book.repo";
import { getLocationByCode } from "./location.service";
import * as LocationService from "./location.service";

const mockedRepoGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookRepo.getRandomBookByLocation
  >;

const mockedRepoGetBooksByLocationId =
  getBooksByLocationId as MockedFunction<
    typeof BookRepo.getBooksByLocationId
  >;

const mockedRepoCreateBook =
  createBook as MockedFunction<
    typeof BookRepo.createBook
  >;

const mockedRepoGetBookById =
  getBookById as MockedFunction<
    typeof BookRepo.getBookById
  >;

const mockedRepoDeleteBookById =
  deleteBookById as MockedFunction<
    typeof BookRepo.deleteBookById
  >;

const mockedRepoCreateBookLocation =
  createBookLocation as MockedFunction<
    typeof BookRepo.createBookLocation
  >;

const mockedRepoDeleteBookLocation =
  deleteBookLocation as MockedFunction<
    typeof BookRepo.deleteBookLocation
  >;

const mockedLocationServiceGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationService.getLocationByCode
  >;

const mockedRepoQueryBooks =
  queryBooks as MockedFunction<
    typeof BookRepo.queryBooks
  >;

describe('getRandomBookByLocation', async () => {
  it('gets random book from service', async () => {
    mockedRepoGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookService.getRandomBookByLocationCode(exampleCountry.code)).toEqual(exampleBook);
    expect(mockedLocationServiceGetLocationByCode).toHaveBeenCalledWith(exampleCountry.code);
  });
});

describe('getBooksByLocationId', async () => {
  it('gets all books for location', async () => {
    const books = [exampleBook];
    mockedRepoGetBooksByLocationId.mockResolvedValue(books);
    expect(await bookService.getBooksByLocationId(exampleCountry.id)).toEqual(books);
  });
});

describe('createBook', async () => {
  it('creates a book with book repo', async () => {
    mockedRepoCreateBook.mockResolvedValue(exampleBook);
    expect(await bookService.createBook(exampleBookReq)).toEqual(exampleBook);
  });
});

describe('getBookById', async () => {
  it('gets book by ID from book repo', async () => {
    mockedRepoGetBookById.mockResolvedValue(exampleBook);
    expect(await bookService.getBookById(exampleBook.id)).toEqual(exampleBook);
  });
});

describe('deleteBookById', async () => {
  it('deletes the book with the repo', async () => {
    await bookService.deleteBookById(exampleBook.id);
    expect(mockedRepoDeleteBookById).toHaveBeenCalledWith(exampleBook.id);
  });
});

describe('createBookLocation', async () => {
  it('creates a book location with the book repo', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookService.createBookLocation(bookLocation);
    expect(mockedRepoCreateBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});

describe('deleteBookLocation', async () => {
  it('deletes a book location with the book repo', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookService.deleteBookLocation(bookLocation);
    expect(mockedRepoDeleteBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});

describe('queryBooks', async () => {
  it('queries books from the book repo', async () => {
    const books = [exampleBook];
    mockedRepoQueryBooks.mockResolvedValue(books);
    const query = "query";
    expect(await bookService.queryBooks(query)).toEqual(books);
  });
});