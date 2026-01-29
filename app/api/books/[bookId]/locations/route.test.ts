import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../../locations/location.controller', () => ({
  getLocationsByBookId: vi.fn()
}));
import * as bookLocationsRoutes from './route';
import { exampleBook, exampleCountry, exampleState } from "@/app/__tests__/fixtures";
import { NextRequest } from "next/server";
import { getLocationsByBookId } from '../../../locations/location.controller'
import type * as LocationController from '../../../locations/location.controller';

const mockedLocationControllerGetLocationsByBookId =
getLocationsByBookId as MockedFunction<
    typeof LocationController.getLocationsByBookId
  >;

describe('GET /locations/:locationId/books', async () => {
  it('gets all books for given location from controller', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedLocationControllerGetLocationsByBookId.mockResolvedValue(locations)

    const reqURL = `http://localhost/api/locations/${exampleBook.id}/books`;
    const reqParams = {params: Promise.resolve({ bookId: exampleBook.id })};
    const req = await bookLocationsRoutes.GET(new NextRequest(reqURL), reqParams);
    const res = await req.json();
    expect(res).toEqual(locations);
  });
});