import { Book } from "@/app/lib/types";
import * as bookService from "./book.service";
import * as locationController from "../locations/location.controller";

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return bookService.getRandomBookByLocation(await locationController.getLocationByCode(locationCode));
}