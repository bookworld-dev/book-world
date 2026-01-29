import { describe, expect, it } from 'vitest';
import { exampleBookReq, exampleCountryReq, exampleStateReq } from '../../__tests__/fixtures';
import { GET } from './random/route';
import { insertBook, insertBookLocation, insertLocation } from '../../__tests__/helpers';
import { NextRequest } from 'next/server';
import { POST as POST_BOOK } from './route';
import { DELETE as DELETE_BOOK, GET as GET_BOOK } from './[bookId]/route';
import { GET as GET_BOOK_LOCATIONS, POST as POST_BOOK_LOCATION } from './[bookId]/locations/route';

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

describe('POST /api/books', async () => {
  it('creates a book', async () => {
    const coverImageFile = new File(
      ['image bytes'],
      'cover.jpg',
      { type: 'image/jpeg' }
    );

    const formData = new FormData();
    formData.append('title', exampleBookReq.title);
    formData.append('author', exampleBookReq.author);
    formData.append('cover', coverImageFile);
    const req = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: formData,
    });
    const res = await POST_BOOK(req);

    const json = await res.json();
    expect(json.id).not.toEqual(undefined);
    expect(json.author).toEqual(exampleBookReq.author);
    expect(json.title).toEqual(exampleBookReq.title);
    expect(json.coverUrl).not.toEqual(undefined);
  });
});

describe('GET /api/books/:bookId', async () => {
  it('gets a book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL);
    const res = await GET_BOOK(req, reqParams);

    expect(res.status).to.equal(200);
    const json = await res.json();
    expect(json.id).toEqual(exampleBook.id);
    expect(json.title).toEqual(exampleBook.title);
    expect(json.author).toEqual(exampleBook.author);
    expect(json.coverUrl).toEqual(exampleBook.coverUrl);
  });
});

describe('DELETE /api/books/:bookId', async () => {
  it('deletes a book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL);
    const res = await DELETE_BOOK(req, reqParams);
    expect(res.status).toEqual(204);

    const get = await GET_BOOK(req, reqParams);
    expect(get.status).toEqual(404);
  });
});

describe('GET /api/books/:bookId/locations', async () => {
  it('gets all locations for the given book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const exampleCountry = await insertLocation(exampleCountryReq, null);
    await insertBookLocation(exampleBook, exampleCountry);
  
    const reqURL = `http://localhost/api/books/${exampleBook.id}/locations`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const req = new NextRequest(reqURL);
    const res = await GET_BOOK_LOCATIONS(req, reqParams);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([exampleCountry]);
  });
});

// describe('POST /api/books/:bookId/locations', async () => {
//   it('adds a location to book', async () => {
//     const exampleBook = await insertBook(exampleBookReq);
//     const exampleCountry = await insertLocation(exampleCountryReq, null);
//     const formData = new FormData();
//     formData.append('locationId', exampleCountry.id);
//     const reqURL = `http://localhost/api/books/${exampleBook.id}/locations`;
//     const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
//     const req = new NextRequest(reqURL, {
//       method: 'POST',
//       body: formData
//     });
//     const res = await POST_BOOK_LOCATION(req, reqParams);
//     expect(res.status).toEqual(201);
//     expect(await res.json()).toEqual({ bookId: exampleBook.id, locationId: exampleCountry.id });
//   });
// });