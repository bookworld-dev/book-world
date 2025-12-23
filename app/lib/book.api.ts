import { apiFetch } from './api';
import { Book } from './types';

export const getRandomBookByLocation = async (location: string): Promise<Book> => {
  return apiFetch<Book>(`/api/books/random?location=${location}`);
};