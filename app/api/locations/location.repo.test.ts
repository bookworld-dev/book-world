import { describe, expect, it } from "vitest";
import * as locationRepo from './location.repo';
import { insertBook, insertBookLocation, insertLocation } from "@/app/__tests__/helpers";
import { exampleBookReq, exampleBookReq2, exampleCountryReq, exampleCountryReq2, exampleStateReq } from "@/app/__tests__/fixtures";
import { LocationNotFoundError } from "./location.errors";
import { randomUUID } from "crypto";

describe('getAllLocations', async () => {
  it('gets all locations from database', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    expect(await locationRepo.getAllLocations()).toEqual([
      country, state
    ]);
  });
});

describe('getPopulatedLocations', async () => {
  it('gets all unique locations associated with a book from the database', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    await insertLocation(exampleCountryReq2, null);
    const book = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    await insertBookLocation(book, country);
    await insertBookLocation(book2, country);

    const locations = await locationRepo.getPopulatedLocations();
    expect(locations).toEqual([country]);
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

describe('getLocationById', async () => {
  it('gets location by id from database', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    expect(await locationRepo.getLocationById(country.id)).toEqual(country);
    expect(await locationRepo.getLocationById(state.id)).toEqual(state);
  });

  it('throws an error when no location found', async () => {
    await expect(locationRepo.getLocationById(randomUUID())).rejects.toBeInstanceOf(LocationNotFoundError);
  });
});