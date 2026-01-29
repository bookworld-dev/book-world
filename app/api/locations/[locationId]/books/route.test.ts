import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../../books/book.controller', () => ({
  getBooksByLocationId: vi.fn(),
}));
import { exampleBook, exampleCountry } from "@/app/__tests__/fixtures";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { getBooksByLocationId } from "../../../books/book.controller";
import type * as BookController from '../../../books/book.controller';

const mockedControllerGetBooksByLocationId =
  getBooksByLocationId as MockedFunction<
    typeof BookController.getBooksByLocationId
  >;

describe('/api/locations/:locationId/books', async () => {
  it('gets all books for location', async () => {
    const books = [exampleBook];
    mockedControllerGetBooksByLocationId.mockResolvedValue(books);
    const reqURL = `http://localhost/api/locations/${exampleCountry.id}/books`;
    const reqParams = {params: Promise.resolve({ locationId: exampleCountry.id })};
    const req = await GET(new NextRequest(reqURL), reqParams);
    expect(await req.json()).toEqual(books);
  });
});