import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../lib/services/book.service', () => ({
  getRandomBookByLocationCode: vi.fn(),
  getBooksByLocationId: vi.fn(),
  createBook: vi.fn(),
  getBookById: vi.fn(),
  deleteBookById: vi.fn(),
  createBookLocation: vi.fn(),
  deleteBookLocation: vi.fn()
}));
vi.mock('../locations/location.controller', () => ({
  getLocationByCode: vi.fn(),
}));
import * as bookController from './book.controller';
import { exampleBook, exampleBookAPIReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocationCode, getBooksByLocationId, createBook, getBookById, deleteBookById, createBookLocation, deleteBookLocation } from "../../lib/services/book.service";
import * as BookService from "../../lib/services/book.service";

const mockedServiceGetRandomBookByLocationCode =
  getRandomBookByLocationCode as MockedFunction<
    typeof BookService.getRandomBookByLocationCode
  >;

const mockedServiceGetBooksByLocationId =
  getBooksByLocationId as MockedFunction<
    typeof BookService.getBooksByLocationId
  >;

const mockedServiceCreateBook =
  createBook as MockedFunction<
    typeof BookService.createBook
  >;

const mockedServiceGetBookById =
  getBookById as MockedFunction<
    typeof BookService.getBookById
  >;

const mockedServiceDeleteBookById =
  deleteBookById as MockedFunction<
    typeof BookService.deleteBookById
  >;

const mockedServiceCreateBookLocation =
  createBookLocation as MockedFunction<
    typeof BookService.createBookLocation
  >;

const mockedServiceDeleteBookLocation =
  deleteBookLocation as MockedFunction<
    typeof BookService.deleteBookLocation
  >;

describe('getRandomBookByLocationCode', async () => {
  it('gets random book from service', async () => {
    mockedServiceGetRandomBookByLocationCode.mockResolvedValue(exampleBook);
    expect(await bookController.getRandomBookByLocationCode(exampleCountry.code)).toEqual(exampleBook);
  });
});

describe('getBooksByLocationId', async () => {
  it('gets all books for given location', async () => {
    const books = [exampleBook];
    mockedServiceGetBooksByLocationId.mockResolvedValue(books);
    expect(await bookController.getBooksByLocationId(exampleCountry.id)).toEqual(books);
  });
});

describe('createBook', async () => {
  it('creates a book with book service', async () => {
    mockedServiceCreateBook.mockResolvedValue(exampleBook);
    expect(await bookController.createBook(exampleBookAPIReq)).toEqual(exampleBook);
  });
});

describe('getBookById', async () => {
  it('gets book by ID from book service', async () => {
    mockedServiceGetBookById.mockResolvedValue(exampleBook);
    expect(await bookController.getBookById(exampleBook.id)).toEqual(exampleBook);
  });
});

describe('deleteBookById', async () => {
  it('deletes the book with the service', async () => {
    await bookController.deleteBookById(exampleBook.id);
    expect(mockedServiceDeleteBookById).toHaveBeenCalledWith(exampleBook.id);
  });
});

describe('createBookLocation', async () => {
  it('creates book location with the service', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookController.createBookLocation(exampleBook.id, exampleCountry.id);
    expect(mockedServiceCreateBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});

describe('deleteBookLocation', async () => {
  it('deletes book location with the service', async () => {
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    await bookController.deleteBookLocation(exampleBook.id, exampleCountry.id);
    expect(mockedServiceDeleteBookLocation).toHaveBeenCalledWith(bookLocation);
  });
});