import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.repo', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocation: vi.fn(),
  createBook: vi.fn(),
  getBookById: vi.fn(),
  deleteBookById: vi.fn(),
  createBookLocation: vi.fn()
}));
import * as bookService from './book.service';
import { exampleBook, exampleBookReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocation, createBook, getBookById, deleteBookById, createBookLocation } from "./book.repo";
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