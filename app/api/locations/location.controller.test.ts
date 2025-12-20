import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./location.service', () => ({
  getLocations: vi.fn(),
}));
import * as locationController from './location.controller';
import { exampleCountry, exampleState } from "../../__tests__/fixtures";
import { getLocations } from "./location.service";
import type * as LocationService from "./location.service"

const mockedServiceGetLocations =
  getLocations as MockedFunction<
    typeof LocationService.getLocations
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getLocations', async () => {
  it('gets all locations from service', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedServiceGetLocations.mockResolvedValue(locations);
    expect(await locationController.getLocations()).toEqual(locations);
  });
});