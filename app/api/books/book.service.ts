import { Book, BookRequest, Location } from "@/app/lib/types";
import * as bookRepo from './book.repo';

export const getRandomBookByLocation = async (location: Location): Promise<Book> => {
  return bookRepo.getRandomBookByLocation(location);
}

export const getBooksByLocation = async (location: Location): Promise<Book[]> => {
  return bookRepo.getBooksByLocation(location);
}

export const createBook = async (bookReq: BookRequest): Promise<Book> => {
  return bookRepo.createBook(bookReq);
}