import { Location } from "@/app/lib/types";
import * as locationService from './location.service';

export const getLocations = async (): Promise<Location[]> => {
  return locationService.getLocations();
}

export const getLocationByCode = async (code: string): Promise<Location> => {
  return locationService.getLocationByCode(code);
}