import { apiFetch } from './api';
import { Book } from './types';

export const getRandomBook = async (country: string): Promise<Book> => {
  return apiFetch<Book>(`/api/books/random?country=${country}`);
};