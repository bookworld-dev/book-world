import { Book } from "@/app/lib/types";
import * as bookRepo from './book.repo';

export const getRandomBookByLocation = async (location: Location): Promise<Book> => {
  return bookRepo.getRandomBookByLocation(location);
}