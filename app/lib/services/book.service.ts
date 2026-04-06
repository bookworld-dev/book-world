import { Book, BookLocation, BookRequest, Location } from "@/app/lib/types";
import * as bookRepo from '../repos/book.repo';

export const getRandomBookByLocation = async (location: Location): Promise<Book> => {
  return bookRepo.getRandomBookByLocation(location);
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return bookRepo.getBooksByLocationId(locationId);
}

export const createBook = async (bookReq: BookRequest): Promise<Book> => {
  return bookRepo.createBook(bookReq);
}

export const getBookById = async (id: string): Promise<Book> => {
  return await bookRepo.getBookById(id);
}

export const deleteBookById = async (id: string) => {
  return await bookRepo.deleteBookById(id);
}

export const createBookLocation = async (bookLocation: BookLocation) => {
  await bookRepo.createBookLocation(bookLocation);
}

export const deleteBookLocation = async (bookLocation: BookLocation) => {
  await bookRepo.deleteBookLocation(bookLocation);
}