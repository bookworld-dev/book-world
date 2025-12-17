import { Book } from "@/app/lib/types";
import * as bookRepo from './book.repo';

export const getRandomBook = async (): Promise<Book> => {
  return bookRepo.getRandomBook();
}