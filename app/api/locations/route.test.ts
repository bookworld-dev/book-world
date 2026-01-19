import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
vi.mock('./location.controller', () => ({
  getLocations: vi.fn(),
}));
import * as locationRoutes from './route';
import { getLocations } from './location.controller';
import type * as LocationController from './location.controller';
import { exampleCountry, exampleState } from '@/app/__tests__/fixtures';
import { NextRequest } from 'next/server';

const mockedControllerGetLocations =
  getLocations as MockedFunction<
    typeof LocationController.getLocations
  >;

describe('/api/locations', async () => {
  it('gets the list of locations', async () => {
    const locations = [exampleCountry, exampleState];
    mockedControllerGetLocations.mockResolvedValue(locations);
    const res = await locationRoutes.GET(new NextRequest('http://localhost/api/locations'));
    expect(await res.json()).toEqual(locations);
    expect(mockedControllerGetLocations).toHaveBeenCalledWith(null);
  });

  it('gets the list of populated locations', async () => {
    const locations = [exampleCountry, exampleState];
    mockedControllerGetLocations.mockResolvedValue(locations);
    const res = await locationRoutes.GET(new NextRequest('http://localhost/api/locations?populated=true'));
    expect(await res.json()).toEqual(locations);
    expect(mockedControllerGetLocations).toHaveBeenCalledWith('true');
  });
});