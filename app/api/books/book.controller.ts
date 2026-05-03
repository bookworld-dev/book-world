import { Storage } from "@google-cloud/storage";
import { Book, BookAPIRequest } from "@/app/lib/types";
import * as bookService from "../../lib/services/book.service";

const BUCKET_NAME = process.env.COVER_IMAGES_BUCKET ?? "bookworld-283512-covers";

const storage = new Storage();

export const getRandomBookByLocationCode = async (locationCode: string): Promise<Book> => {
  return await bookService.getRandomBookByLocationCode(locationCode);
}

export const getBooksByLocationId = async (locationId: string): Promise<Book[]> => {
  return await bookService.getBooksByLocationId(locationId);
}

const uploadCover = async (cover: File): Promise<string> => {
  const buffer = Buffer.from(await cover.arrayBuffer());
  const ext = cover.type === "image/png" ? "png" : "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  await storage.bucket(BUCKET_NAME).file(filename).save(buffer, {
    metadata: { contentType: cover.type },
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
}

export const createBook = async (bookAPIReq: BookAPIRequest): Promise<Book> => {
  const { author, title, cover } = bookAPIReq;
  const coverUrl = await uploadCover(cover);
  return await bookService.createBook({ author, title, coverUrl });
}

export const getBookById = async (id: string): Promise<Book> => {
  return await bookService.getBookById(id);
}

export const deleteBookById = async (id: string) => {
  return await bookService.deleteBookById(id);
}

export const createBookLocation = async (bookId: string, locationId: string) => {
  await bookService.createBookLocation({ bookId, locationId });
}

export const deleteBookLocation = async (bookId: string, locationId: string) => {
  await bookService.deleteBookLocation({ bookId, locationId });
}

export const queryBooks = async (query: string): Promise<Book[]> => {
  return await bookService.queryBooks(query);
}