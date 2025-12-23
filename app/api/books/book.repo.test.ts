import { exampleBookReq, exampleBookReq2, exampleCountryReq, exampleCountryReq2 } from "@/app/__tests__/fixtures";
import { insertBook, insertBookLocation, insertLocation } from "@/app/__tests__/helpers";
import { describe, expect, it } from "vitest";
import * as bookRepo from './book.repo';
import { BookNotFoundError } from "./book.errors";

describe('getRandomBookByLocation', async () => {
  it('gets a random book for the location', async () => {
    const book1 = await insertBook(exampleBookReq);
    const country1 = await insertLocation(exampleCountryReq, null);
    await insertBookLocation(book1, country1);

    const book2 = await insertBook(exampleBookReq2);
    const country2 = await insertLocation(exampleCountryReq2, null);
    await insertBookLocation(book2, country2);

    expect(await bookRepo.getRandomBookByLocation(country1)).toEqual(book1);

    expect(await bookRepo.getRandomBookByLocation(country2)).toEqual(book2);
  });

  it('throws an error when no book', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    await expect(bookRepo.getRandomBookByLocation(country)).rejects.toBeInstanceOf(BookNotFoundError);
  });
});