import { Book, BookAPIRequest } from "@/app/lib/types";
import * as bookService from "./book.service";
import * as locationController from "../locations/location.controller";

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return bookService.getRandomBookByLocation(await locationController.getLocationByCode(locationCode));
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return bookService.getBooksByLocation(await locationController.getLocationById(locationId));
}

const uploadCover = (bookAPIReq: BookAPIRequest): string => {
  return "";
}

export const createBook = async (bookAPIReq: BookAPIRequest): Promise<Book> => {
  const { author, title } = bookAPIReq;
  const coverUrl = uploadCover(bookAPIReq);
  return bookService.createBook({ author, title, coverUrl });
}