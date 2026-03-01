import { Location } from "@/app/lib/types";
import * as locationRepo from '../repos/location.repo';

export const getLocations = async (populated: boolean): Promise<Location[]> => {
  return populated ?
    locationRepo.getPopulatedLocations() :
    locationRepo.getAllLocations();
}

export const getLocationByCode = async (code: string): Promise<Location> => {
  return await locationRepo.getLocationByCode(code);
}

export const getLocationById = async (id: string): Promise<Location> => {
  return await locationRepo.getLocationById(id);
}

export const getLocationsByBookId = async (bookId: string): Promise<Location[]> => {
  return await locationRepo.getLocationsByBookId(bookId);
}