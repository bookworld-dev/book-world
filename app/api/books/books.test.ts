import { describe, expect, it } from 'vitest';
import { exampleBookReq, exampleCountryReq, exampleStateReq } from '../../__tests__/fixtures';
import { GET } from './random/route';
import { insertBook, insertBookLocation, insertLocation } from '../../__tests__/helpers';
import { NextRequest } from 'next/server';

describe('GET /api/books/random', async () => {
  it('gets a random book for given location', async () => {
    const book = await insertBook(exampleBookReq);
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    await insertBookLocation(book, country);
    await insertBookLocation(book, state);
    let req = await GET(new NextRequest(`http://localhost/api/books/random?location=${country.code}`));
    expect(await req.json()).toEqual(book);
    req = await GET(new NextRequest(`http://localhost/api/books/random?location=${state.code}`));
    expect(await req.json()).toEqual(book);
  });
});