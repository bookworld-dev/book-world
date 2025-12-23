import { describe, expect, it } from "vitest";
import * as locationRepo from './location.repo';
import { insertLocation } from "@/app/__tests__/helpers";
import { exampleCountryReq, exampleStateReq } from "@/app/__tests__/fixtures";
import { LocationNotFoundError } from "./location.errors";

describe('getLocations', async () => {
  it('gets all locations from database', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    expect(await locationRepo.getLocations()).toEqual([
      country, state
    ]);
  });
});

describe('getLocationByCode', async () => {
  it('gets location by code from database', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    expect(await locationRepo.getLocationByCode(country.code)).toEqual(country);
    expect(await locationRepo.getLocationByCode(state.code)).toEqual(state);
  });

  it('throws an error when no location found', async () => {
    await expect(locationRepo.getLocationByCode('ZZ')).rejects.toBeInstanceOf(LocationNotFoundError);
  });
});