import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.service', () => ({
  getRandomBookByLocation: vi.fn(),
}));
vi.mock('../locations/location.controller', () => ({
  getLocationByCode: vi.fn(),
}));
import * as bookController from './book.controller';
import { exampleBook, exampleCountry } from "../../__tests__/fixtures";
import { getRandomBookByLocation } from "./book.service";
import type * as BookService from "./book.service";
import { getLocationByCode } from "../locations/location.controller";
import type * as LocationController from "../locations/location.controller";

const mockedServiceGetRandomBook =
  getRandomBookByLocation as MockedFunction<
    typeof BookService.getRandomBookByLocation
  >;

const mockedLocationControllerGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationController.getLocationByCode
  >;

describe('getRandomBookByLocationCode', async () => {
  it('gets random book from service', async () => {
    mockedLocationControllerGetLocationByCode.mockResolvedValue(exampleCountry);
    mockedServiceGetRandomBook.mockResolvedValue(exampleBook);
    expect(await bookController.getRandomBookByLocationCode(exampleCountry.code)).toEqual(exampleBook);
  });
});