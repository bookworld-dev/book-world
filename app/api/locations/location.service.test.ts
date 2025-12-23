import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./location.repo', () => ({
  getLocations: vi.fn(),
  getLocationByCode: vi.fn()
}));
import * as locationService from './location.service';
import { exampleCountry, exampleState } from "../../__tests__/fixtures";
import { getLocations, getLocationByCode } from "./location.repo";
import type * as LocationRepo from "./location.repo"

const mockedRepoGetLocations =
  getLocations as MockedFunction<
    typeof LocationRepo.getLocations
  >;

  const mockedRepoGetLocationByCode =
    getLocationByCode as MockedFunction<
      typeof LocationRepo.getLocationByCode
    >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getLocations', async () => {
  it('gets all locations from repo', async () => {
    const locations = [ exampleCountry, exampleState ];
    mockedRepoGetLocations.mockResolvedValue(locations);
    expect(await locationService.getLocations()).toEqual(locations);
  });
});

describe('getLocationByCode', async () => {
  it('gets location by code from repo', async () => {
    mockedRepoGetLocationByCode.mockResolvedValue(exampleCountry);
    expect(await locationService.getLocationByCode(exampleCountry.code)).toEqual(exampleCountry);
  });
});