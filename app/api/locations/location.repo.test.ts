import { describe, expect, it } from "vitest";
import * as locationRepo from './location.repo';
import { insertLocation } from "@/app/__tests__/helpers";
import { exampleCountry, exampleState } from "@/app/__tests__/fixtures";

describe('getLocations', async () => {
  it('gets all locations from database', async () => {
    await insertLocation(exampleCountry);
    await insertLocation(exampleState);
    expect(await locationRepo.getLocations()).toEqual([
      exampleCountry, exampleState
    ]);
  });
});