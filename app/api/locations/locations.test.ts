import { exampleBookReq, exampleCountryReq, exampleStateReq } from '@/app/__tests__/fixtures';
import { describe, expect, it } from 'vitest';
import * as locationsRoutes from './route';
import * as locationBooksRoutes from './[locationId]/books/route';
import { insertBook, insertBookLocation, insertLocation } from '@/app/__tests__/helpers';
import { NextRequest } from 'next/server';

describe('GET /locations', async () => {
  it('gets all locations', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    const reqURL = 'http://localhost/api/locations';
    const req = await locationsRoutes.GET(new NextRequest(reqURL));
    const res = await req.json();
    expect(res).toContainEqual(country);
    expect(res).toContainEqual(state);
  });

  it('gets all populated locations', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    const book = await insertBook(exampleBookReq);
    await insertBookLocation(book, country);

    const reqURL = 'http://localhost/api/locations?populated=true';
    const req = await locationsRoutes.GET(new NextRequest(reqURL));
    const res = await req.json();
    expect(res).toContainEqual(country);
    expect(res).not.toContainEqual(state);
  });
});

describe('GET /locations/:locationId/books', async () => {
  it('gets all books for given location', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const book = await insertBook(exampleBookReq);
    await insertBookLocation(book, country);

    const reqURL = `http://localhost/api/locations/${country.id}/books`;
    const reqParams = {params: { locationId: country.id }};
    const req = await locationBooksRoutes.GET(new NextRequest(reqURL), reqParams);
    const res = await req.json();
    expect(res).toEqual([book]);
  });
});