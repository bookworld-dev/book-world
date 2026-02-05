import { apiFetch } from './api';
import { Location } from './types';

export const getLocations = async (populated?: boolean): Promise<Location[]> => {
  return apiFetch<Location[]>(`/api/locations?populated=${populated}`);
};