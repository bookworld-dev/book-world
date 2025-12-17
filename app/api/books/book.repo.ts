import { Book } from "@/app/lib/types";

export const getRandomBook = async (): Promise<Book> => {
  return {
    id: '33',
    title: 'sdkjgfh',
    author: 'bfd',
    country: 'germany',
    coverUrl: 'bb'
  };
}