import { exampleBookReq, exampleCountryReq, exampleStateReq } from '@/app/__tests__/fixtures';
import { describe, expect, it } from 'vitest';
import { GET } from './route';
import { insertBook, insertBookLocation, insertLocation } from '@/app/__tests__/helpers';
import { NextRequest } from 'next/server';

describe('GET /locations', async () => {
  it('gets all locations', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    const reqURL = 'http://localhost/api/locations';
    const req = await GET(new NextRequest(reqURL));
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
    const req = await GET(new NextRequest(reqURL));
    const res = await req.json();
    expect(res).toContainEqual(country);
    expect(res).not.toContainEqual(state);
  });
});