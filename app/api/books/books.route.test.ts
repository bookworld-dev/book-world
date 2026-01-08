import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('./book.controller', () => ({
  createBook: vi.fn(),
}));
import { exampleBook, exampleBookAPIReq, exampleBookReq } from "@/app/__tests__/fixtures";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { createBook } from "./book.controller";
import type * as BookController from './book.controller';

const mockedBookControllerCreateBook =
  createBook as MockedFunction<
    typeof BookController.createBook
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