import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.service', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocation: vi.fn(),
  createBook: vi.fn(),
  getBookById: vi.fn(),
  deleteBookById: vi.fn()
}));
vi.mock('../locations/location.controller', () => ({
  getLocationByCode: vi.fn(),
  getLocationById: vi.fn(),
}));
import * as bookController from './book.controller';
import { exampleBook, exampleBookAPIReq, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocation, createBook, getBookById, deleteBookById } from "./book.service";
import type * as BookService from "./book.service";
import { getLocationByCode, getLocationById } from "../locations/location.controller";
import type * as LocationController from "../locations/location.controller";

const mockedServiceGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookService.getRandomBookByLocation
  >;

const mockedServiceGetBooksByLocation =
  getBooksByLocation as MockedFunction<
    typeof BookService.getBooksByLocation
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

const mockedLocationControllerGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationController.getLocationByCode
  >;

const mockedLocationControllerGetLocationById =
  getLocationById as MockedFunction<
    typeof LocationController.getLocationById
  >;

describe('getRandomBookByLocationCode', async () => {
  it('gets random book from service', async () => {
    mockedLocationControllerGetLocationByCode.mockResolvedValue(exampleCountry);
    mockedServiceGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookController.getRandomBookByLocationCode(exampleCountry.code)).toEqual(exampleBook);
  });
});

describe('getBooksByLocation', async () => {
  it('gets all books for given location', async () => {
    const books = [exampleBook];
    mockedLocationControllerGetLocationById.mockResolvedValue(exampleCountry);
    mockedServiceGetBooksByLocation.mockResolvedValue(books);
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