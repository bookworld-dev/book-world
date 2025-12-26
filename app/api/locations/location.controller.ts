import { Location } from "@/app/lib/types";
import * as locationService from './location.service';

export const getLocations = async (populatedQueryParam: string|null): Promise<Location[]> => {
  const populated = populatedQueryParam === 'true';
  return locationService.getLocations(populated);
}

export const getLocationByCode = async (code: string): Promise<Location> => {
  return locationService.getLocationByCode(code);
}

export const getLocationById = async (id: string): Promise<Location> => {
  return locationService.getLocationById(id);
}