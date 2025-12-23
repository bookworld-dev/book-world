import { Location } from "@/app/lib/types";
import * as locationRepo from './location.repo';

export const getLocations = async(populated: boolean): Promise<Location[]> => {
  return populated ?
    locationRepo.getPopulatedLocations() :
    locationRepo.getAllLocations();
}

export const getLocationByCode = async(code: string): Promise<Location> => {
  return locationRepo.getLocationByCode(code);
}