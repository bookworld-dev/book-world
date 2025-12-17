import { Book } from "@/app/lib/types";
import * as bookService from "./book.service";

export const getRandomBook = async (): Promise<Book> => {
  return bookService.getRandomBook();
}