import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../../locations/location.controller', () => ({
  getLocationsByBookId: vi.fn()
}));
vi.mock('../../book.controller', () => ({
  createBookLocation: vi.fn()
}));
import * as bookLocationsRoutes from './route';
import { exampleBook, exampleCountry, exampleState } from "@/app/__tests__/fixtures";
import { NextRequest } from "next/server";
import { getLocationsByBookId } from '../../../locations/location.controller';
import type * as LocationController from '../../../locations/location.controller';
import { createBookLocation } from '../../book.controller';
import type * as BookController from '../../book.controller';

const mockedLocationControllerGetLocationsByBookId =
  getLocationsByBookId as MockedFunction<
    typeof LocationController.getLocationsByBookId
  >;

const mockedBookControllerCreateBookLocation =
  createBookLocation as MockedFunction<
    typeof BookController.createBookLocation
  >;

describe('GET /locations/:locationId/books', async () => {
  it('gets all books for given location from location controller', async () => {
    const locations = [exampleCountry, exampleState];
    mockedLocationControllerGetLocationsByBookId.mockResolvedValue(locations);

    const reqURL = `http://localhost/api/locations/${exampleBook.id}/books`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = await bookLocationsRoutes.GET(new NextRequest(reqURL), reqParams);
    const res = await req.json();
    expect(res).toEqual(locations);
  });
});

describe('POST /locations/:locationId/books', async () => {
  it('creates a book location with the book controller', async () => {
    const formData = new FormData();
    formData.append('locationId', exampleCountry.id);
    const reqURL = `http://localhost/api/books/${exampleBook.id}/locations`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    let req = new NextRequest(reqURL, {
      method: 'POST',
      body: formData
    });
    let res = await bookLocationsRoutes.POST(req, reqParams);
    expect(res.status).toEqual(201);
    const bookLocation = { bookId: exampleBook.id, locationId: exampleCountry.id };
    expect(await res.json()).toEqual(bookLocation);
    expect(mockedBookControllerCreateBookLocation).toHaveBeenCalledWith(exampleBook.id, exampleCountry.id);
  });
});