import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./location.repo', () => ({
  getAllLocations: vi.fn(),
  getPopulatedLocations: vi.fn(),
  getLocationByCode: vi.fn(),
  getLocationById: vi.fn(),
  getLocationsByBookId: vi.fn()
}));
import * as locationService from './location.service';
import { exampleBook, exampleCountry, exampleState } from "../../__tests__/fixtures";
import { getAllLocations, getLocationByCode, getPopulatedLocations, getLocationsByBookId } from "./location.repo";
import type * as LocationRepo from "./location.repo";
import { getLocationById } from "./location.repo";

const mockedRepoGetAllLocations =
  getAllLocations as MockedFunction<
    typeof LocationRepo.getAllLocations
  >;

const mockedRepoGetPopulatedLocations =
  getPopulatedLocations as MockedFunction<
    typeof LocationRepo.getPopulatedLocations
  >;

const mockedRepoGetLocationByCode =
  getLocationByCode as MockedFunction<
    typeof LocationRepo.getLocationByCode
  >;

const mockedRepoGetLocationById =
  getLocationById as MockedFunction<
    typeof LocationRepo.getLocationById
  >;

const mockedRepoGetLocationsByBookId =
  getLocationsByBookId as MockedFunction<
    typeof LocationRepo.getLocationsByBookId
  >;

describe('getLocations', async () => {
  it('gets all locations from repo', async () => {
    const locations = [exampleCountry, exampleState];
    mockedRepoGetAllLocations.mockResolvedValue(locations);
    expect(await locationService.getLocations(false)).toEqual(locations);
  });

  it('gets all populated locations from repo', async () => {
    const locations = [exampleCountry];
    mockedRepoGetPopulatedLocations.mockResolvedValue(locations);
    expect(await locationService.getLocations(true)).toEqual(locations);
  });
});

describe('getLocationByCode', async () => {
  it('gets location by code from repo', async () => {
    mockedRepoGetLocationByCode.mockResolvedValue(exampleCountry);
    expect(await locationService.getLocationByCode(exampleCountry.code)).toEqual(exampleCountry);
  });
});

describe('getLocationById', async () => {
  it('gets location by id from repo', async () => {
    mockedRepoGetLocationById.mockResolvedValue(exampleCountry);
    expect(await locationService.getLocationById(exampleCountry.id)).toEqual(exampleCountry);
  });
});

describe('getLocationsByBookId', async () => {
  it('gets locations by given book ID from location repo', async () => {
    const locations = [exampleCountry, exampleState];
    mockedRepoGetLocationsByBookId.mockResolvedValue(locations);
    expect(await locationService.getLocationsByBookId(exampleBook.id)).toEqual(locations);
  });
});