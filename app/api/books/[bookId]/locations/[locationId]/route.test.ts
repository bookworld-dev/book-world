import { describe, expect, it, MockedFunction, vi } from "vitest";
vi.mock('../../../book.controller', () => ({
  deleteBookLocation: vi.fn()
}));
import * as bookLocationRoute from './route';
import { exampleBook, exampleCountry } from "@/app/__tests__/fixtures";
import { NextRequest } from "next/server";
import { deleteBookLocation } from '../../../book.controller';
import type * as BookController from '../../../book.controller';

const mockedBookControllerDeleteBookLocation =
  deleteBookLocation as MockedFunction<
    typeof BookController.deleteBookLocation
  >;

describe('DELETE /api/books/:bookId/locations/:locationId', async () => {
  it('deletes a book location with the book controller', async () => {
    const reqURL = `http://localhost/api/books/${exampleBook.id}/locations/${exampleCountry.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id, locationId: exampleCountry.id }) };
    const req = new NextRequest(reqURL, { method: 'DELETE' });
    const res = await bookLocationRoute.DELETE(req, reqParams);
    expect(res.status).toEqual(204);
    expect(mockedBookControllerDeleteBookLocation).toHaveBeenCalledWith(exampleBook.id, exampleCountry.id);
  });
});
