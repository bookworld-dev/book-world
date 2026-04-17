import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.controller', () => ({
  createBook: vi.fn(),
  queryBooks: vi.fn()
}));
import { exampleBook, exampleBookAPIReq } from "@/app/__tests__/fixtures";
import { NextRequest } from "next/server";
import { POST, GET } from "./route";
import { createBook, queryBooks } from "./book.controller";
import type * as BookController from './book.controller';

const mockedBookControllerCreateBook =
  createBook as MockedFunction<
    typeof BookController.createBook
  >;

const mockedBookControllerQueryBook =
  queryBooks as MockedFunction<
    typeof BookController.queryBooks
  >;

describe('POST /api/books', async () => {
  it('creates a book through book controller', async () => {
    mockedBookControllerCreateBook.mockResolvedValue(exampleBook);

    const formData = new FormData();
    formData.append('title', exampleBookAPIReq.title);
    formData.append('author', exampleBookAPIReq.author);
    formData.append('cover', exampleBookAPIReq.cover);
    const req = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);

    const json = await res.json();
    expect(json.id).toEqual(exampleBook.id);
    expect(json.author).toEqual(exampleBook.author);
    expect(json.title).toEqual(exampleBook.title);
    expect(json.coverUrl).toEqual(exampleBook.coverUrl);
  });
});

describe('GET /api/books', async () => {
  it('searches for books based on query', async () => {
    mockedBookControllerQueryBook.mockResolvedValue([exampleBook]);

    let reqURL = `http://localhost/api/books?q=query`;
    let req = new NextRequest(reqURL);
    let res = await GET(req);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([exampleBook]);
  });

  it('returns an empty list if query is missing', async () => {
    let reqURL = `http://localhost/api/books`;
    let req = new NextRequest(reqURL);
    let res = await GET(req);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([]);
  });
});