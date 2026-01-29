import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./location.repo', () => ({
  getAllLocations: vi.fn(),
  getPopulatedLocations: vi.fn(),
  getLocationByCode: vi.fn(),
  getLocationById: vi.fn()
}));
import * as locationService from './location.service';
import { exampleCountry, exampleState } from "../../__tests__/fixtures";
import { getAllLocations, getLocationByCode, getPopulatedLocations } from "./location.repo";
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

describe('getLocaionById', async () => {
  it('gets location by id from repo', async () => {
    mockedRepoGetLocationById.mockResolvedValue(exampleCountry);
    expect(await locationService.getLocationById(exampleCountry.id)).toEqual(exampleCountry);
  });
});