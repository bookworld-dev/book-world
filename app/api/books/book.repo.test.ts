import { exampleBook } from "@/app/__tests__/fixtures";
import { insertBook } from "@/app/__tests__/helpers";
import { describe, expect, it } from "vitest";
import * as bookRepo from './book.repo';
import { BookNotFoundError } from "./book.errors";

describe('getRandomBook', async () => {
  it('gets a random book', async () => {
    await insertBook(exampleBook);
    expect(await bookRepo.getRandomBook()).toEqual(exampleBook);
  });

  it('throws an error when no book', async () => {
    await expect(bookRepo.getRandomBook()).rejects.toBeInstanceOf(
      BookNotFoundError
    );
  });
});