import { exampleBookReq, exampleBookReq2, exampleCountry, exampleCountryReq, exampleCountryReq2, exampleState, exampleStateReq } from "@/app/__tests__/fixtures";
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

describe('getBooksByLocation', async () => {
  it('gets all books for location from database', async () => {
    const book1 = await insertBook(exampleBookReq);
    const book2 = await insertBook(exampleBookReq2);
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    await insertBookLocation(book1, country);
    await insertBookLocation(book2, country);

    expect(await bookRepo.getBooksByLocation(country)).toContainEqual(book1);
    expect(await bookRepo.getBooksByLocation(country)).toContainEqual(book2);
    expect(await bookRepo.getBooksByLocation(state)).to.be.empty;
  });
});

describe('createBook', async () => {
  it('creates a book in the database', async () => {
    const createdBook = await bookRepo.createBook(exampleBookReq);

    expect(createdBook.id).not.toEqual(undefined);
    expect(createdBook.title).toEqual(exampleBookReq.title);
    expect(createdBook.author).toEqual(exampleBookReq.author);
    expect(createdBook.coverUrl).toEqual(exampleBookReq.coverUrl);
  });
});

describe('getBookById', async () => {
  it('gets a book from the database by ID', async () => {
    const book = await insertBook(exampleBookReq);
    expect(await bookRepo.getBookById(book.id)).toEqual(book);
  });
});

describe('deleteBookById', async () => {
  it('deletes the book from the database', async () => {
    const book = await insertBook(exampleBookReq);
    await bookRepo.deleteBookById(book.id);
    await expect(bookRepo.getBookById(book.id)).rejects.toBeInstanceOf(BookNotFoundError);
  });
});

describe('createBookLocation', async () => {
  it('creates the book location in the database', async () => {
    const book = await insertBook(exampleBookReq);
    const location = await insertLocation(exampleCountryReq, null);
    await bookRepo.createBookLocation({ bookId: book.id, locationId: location.id });
  
    expect(await bookRepo.getBooksByLocation(location)).toEqual([ book ]);
  });
});