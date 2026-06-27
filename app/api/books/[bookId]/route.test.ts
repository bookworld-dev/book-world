import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../book.controller', () => ({
  getBookById: vi.fn(),
  deleteBookById: vi.fn(),
  updateBookDescription: vi.fn(),
}));
import { exampleBook } from "@/app/__tests__/fixtures";
import { getBookById, deleteBookById, updateBookDescription } from '../book.controller';
import type * as BookController from '../book.controller';
import { DELETE, GET, PATCH } from "./route";
import { NextRequest } from "next/server";

const mockedBookControllerGetBookById =
  getBookById as MockedFunction<
    typeof BookController.getBookById
  >;

const mockedBookControllerDeleteBookById =
  deleteBookById as MockedFunction<
    typeof BookController.deleteBookById
  >;

const mockedBookControllerUpdateBookDescription =
  updateBookDescription as MockedFunction<
    typeof BookController.updateBookDescription
  >;

describe('GET api/books/:bookId', async () => {
  it('gets book by ID from the controller', async () => {
    mockedBookControllerGetBookById.mockResolvedValue(exampleBook);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL);
    const res = await GET(req, reqParams);

    expect(res.status).to.equal(200);
    const json = await res.json();
    expect(json.id).toEqual(exampleBook.id);
    expect(json.title).toEqual(exampleBook.title);
    expect(json.author).toEqual(exampleBook.author);
  });
});

describe('PATCH api/books/:bookId', async () => {
  it('updates description via the controller', async () => {
    const updatedBook = { ...exampleBook, description: 'A new description' };
    mockedBookControllerUpdateBookDescription.mockResolvedValue(updatedBook);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL, {
      method: 'PATCH',
      body: JSON.stringify({ description: 'A new description' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, reqParams);

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(updatedBook);
    expect(mockedBookControllerUpdateBookDescription).toHaveBeenCalledWith(exampleBook.id, 'A new description');
  });

  it('returns 400 when description is missing', async () => {
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL, {
      method: 'PATCH',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, reqParams);
    expect(res.status).toEqual(400);
  });
});

describe('DELETE api/books/:bookId', async () => {
  it('deletes book by ID with the controller', async () => {
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL);
    const res = await DELETE(req, reqParams);
    expect(res.status).toEqual(204);
    expect(mockedBookControllerDeleteBookById).toHaveBeenCalledWith(exampleBook.id);
  });
});
