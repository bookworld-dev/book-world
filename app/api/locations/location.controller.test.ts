import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../lib/services/location.service', () => ({
  getLocations: vi.fn(),
  getLocationByCode: vi.fn(),
  getLocationById: vi.fn(),
  getLocationsByBookId: vi.fn()
}));
import * as locationController from './location.controller';
import { exampleBook, exampleCountry, exampleState } from "../../__tests__/fixtures";
import { getLocations, getLocationByCode, getLocationById, getLocationsByBookId } from "../../lib/services/location.service";
import type * as LocationService from "../../lib/services/location.service"

const mockedServiceGetLocations =
  getLocations as MockedFunction<
    typeof LocationService.getLocations
  >;

const mockedServiceGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationService.getLocationByCode
  >;

const mockedServiceGetLocationById =
  getLocationById as MockedFunction<
    typeof LocationService.getLocationById
  >;

const mockedServiceGetLocationsByBookId =
  getLocationsByBookId as MockedFunction<
    typeof LocationService.getLocationsByBookId
  >;

describe('getLocations', async () => {
  it('gets all locations from service', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedServiceGetLocations.mockResolvedValue(locations);
    expect(await locationController.getLocations(null)).toEqual(locations);
    expect(mockedServiceGetLocations).toHaveBeenCalledWith(false);
  });

  it('gets all populated locations from service', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedServiceGetLocations.mockResolvedValue(locations);
    expect(await locationController.getLocations('true')).toEqual(locations);
    expect(mockedServiceGetLocations).toHaveBeenCalledWith(true);
  });
});

describe('getLocationByCode', async () => {
  it('gets location by given code', async () => {
    mockedServiceGetLocationByCode.mockResolvedValue(exampleCountry);
    expect(await locationController.getLocationByCode(exampleCountry.code)).toEqual(exampleCountry);
  });
});

describe('getLocationById', async () => {
  it('gets location by given ID', async () => {
    mockedServiceGetLocationById.mockResolvedValue(exampleCountry);
    expect(await locationController.getLocationById(exampleCountry.id)).toEqual(exampleCountry);
  });
});

describe('getLocationsByBookId', async () => {
  it('gets locations by given book ID', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedServiceGetLocationsByBookId.mockResolvedValue(locations);
    expect(await locationController.getLocationsByBookId(exampleBook.id)).toEqual(locations);
  });
});