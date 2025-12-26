import { Book } from "@/app/lib/types";
import * as bookService from "./book.service";
import * as locationController from "../locations/location.controller";

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return bookService.getRandomBookByLocation(await locationController.getLocationByCode(locationCode));
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return bookService.getBooksByLocation(await locationController.getLocationById(locationId));
}