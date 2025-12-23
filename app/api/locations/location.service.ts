import { Location } from "@/app/lib/types";
import * as locationRepo from './location.repo';

export const getLocations = async(): Promise<Location[]> => {
  return locationRepo.getLocations();
}

export const getLocationByCode = async(code: string): Promise<Location> => {
  return locationRepo.getLocationByCode(code);
}