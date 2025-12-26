import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.service', () => ({
  getRandomBookByLocation: vi.fn(),
  getBooksByLocation: vi.fn(),
}));
vi.mock('../locations/location.controller', () => ({
  getLocationByCode: vi.fn(),
  getLocationById: vi.fn(),
}));
import * as bookController from './book.controller';
import { exampleBook, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation, getBooksByLocation } from "./book.service";
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