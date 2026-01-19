import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../book.controller', () => ({
  getBookById: vi.fn(),
}));
import { exampleBook } from "@/app/__tests__/fixtures";
import { getBookById } from '../book.controller';
import type * as BookController from '../book.controller';
import { GET } from "./route";
import { NextRequest } from "next/server";

const mockedBookControllerGetBookById =
  getBookById as MockedFunction<
    typeof BookController.getBookById
  >;

describe('GET api/books/:bookId', async () => {
  it('gets book by ID from the controller', async () => {
    mockedBookControllerGetBookById.mockResolvedValue(exampleBook);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = {params: { bookId: exampleBook.id }};
    const req = new NextRequest(reqURL);
    const res = await GET(req, reqParams);

    expect(res.status).to.equal(200);
    const json = await res.json();
    expect(json.id).toEqual(exampleBook.id);
    expect(json.title).toEqual(exampleBook.title);
    expect(json.author).toEqual(exampleBook.author);
    expect(json.coverUrl).toEqual(exampleBook.coverUrl);
  });
});