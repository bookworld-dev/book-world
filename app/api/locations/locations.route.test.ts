import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
vi.mock('./location.controller', () => ({
  getLocations: vi.fn(),
}));
import * as locationRoutes from './route';
import { getLocations } from './location.controller';
import type * as LocationController from './location.controller';
import { exampleCountry, exampleState } from '@/app/__tests__/fixtures';

const mockedControllerGetLocations =
  getLocations as MockedFunction<
    typeof LocationController.getLocations
  >;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/locations', async () => {
  it('gets the list of locations', async () => {
    const locations = [exampleCountry, exampleState];
    mockedControllerGetLocations.mockResolvedValue(locations);
    const res = await locationRoutes.GET();
    expect(await res.json()).toEqual(locations);
  });
});