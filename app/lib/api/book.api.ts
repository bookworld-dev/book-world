import { apiDelete, apiFetch } from './api';
import { Book, BookAPIRequest, BookLocation } from '../types';

export const getRandomBookByLocation = async (location: string): Promise<Book> => {
  return apiFetch<Book>(`/api/books/random?location=${location}`);
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  return apiFetch<Book[]>(`/api/books?q=${query}`);
};

export const createBook = async (book: BookAPIRequest): Promise<Book> => {
  const formData = new FormData();
  formData.append('title', book.title);
  formData.append('author', book.author);
  formData.append('cover', book.cover);
  return apiFetch<Book>('/api/books', { method: 'POST', body: formData });
};

export const createBookLocation = async (bookLocation: BookLocation): Promise<BookLocation> => {
  const { bookId, locationId } = bookLocation;
  const formData = new FormData();
  formData.append('locationId', locationId);
  return apiFetch<BookLocation>(`/api/books/${bookId}/locations`, { method: 'POST', body: formData });
};

export const deleteBookLocation = async (bookId: string, locationId: string) => {
  await apiDelete(`/api/books/${bookId}/locations/${locationId}`);
};