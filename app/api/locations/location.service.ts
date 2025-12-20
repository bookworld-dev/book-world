import { Location } from "@/app/lib/types";
import * as locationRepo from './location.repo';

export const getLocations = async(): Promise<Location[]> => {
  return locationRepo.getLocations();
}