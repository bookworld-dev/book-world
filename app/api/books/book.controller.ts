import { Book, BookAPIRequest, BookLocation } from "@/app/lib/types";
import * as bookService from "../../lib/services/book.service";
import * as locationController from "../locations/location.controller";

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return await bookService.getRandomBookByLocation(await locationController.getLocationByCode(locationCode));
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return await bookService.getBooksByLocation(await locationController.getLocationById(locationId));
}

const uploadCover = (bookAPIReq: BookAPIRequest): string => {
  return "";
}

export const createBook = async (bookAPIReq: BookAPIRequest): Promise<Book> => {
  const { author, title } = bookAPIReq;
  const coverUrl = uploadCover(bookAPIReq);
  return await bookService.createBook({ author, title, coverUrl });
}

export const getBookById = async (id: string): Promise<Book> => {
  return await bookService.getBookById(id);
}

export const deleteBookById = async (id: string) => {
  return await bookService.deleteBookById(id);
}

export const createBookLocation = async (bookLocation: BookLocation) => {
  await bookService.createBookLocation(bookLocation);
}