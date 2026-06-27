import { describe, expect, it, vi } from 'vitest';
vi.mock('../../lib/storage/cover', () => ({
  uploadCover: vi.fn().mockResolvedValue('https://storage.googleapis.com/test-bucket/test.jpg'),
  deleteCover: vi.fn().mockResolvedValue(undefined),
}));
import { exampleBookReq, exampleBookReq2, exampleCountryReq, exampleStateReq } from '../../__tests__/fixtures';
import { GET } from './random/route';
import { insertBook, insertBookLocation, insertLocation } from '../../__tests__/helpers';
import { NextRequest } from 'next/server';
import { POST as POST_BOOK, GET as QUERY_BOOK } from './route';
import { DELETE as DELETE_BOOK, GET as GET_BOOK, PATCH as PATCH_BOOK } from './[bookId]/route';
import { GET as GET_BOOK_LOCATIONS, POST as POST_BOOK_LOCATION } from './[bookId]/locations/route';
import { DELETE as DELETE_BOOK_LOCATION } from './[bookId]/locations/[locationId]/route';

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
  });

  it('creates a book with a description', async () => {
    const coverImageFile = new File(['image bytes'], 'cover.jpg', { type: 'image/jpeg' });
    const description = 'Book description'
    const formData = new FormData();
    formData.append('title', exampleBookReq.title);
    formData.append('author', exampleBookReq.author);
    formData.append('cover', coverImageFile);
    formData.append('description', description);
    const req = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: formData,
    });
    const res = await POST_BOOK(req);

    const json = await res.json();
    expect(json.description).toEqual(description);
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
  });
});

describe('PATCH /api/books/:bookId', async () => {
  it('updates the description of a book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const reqURL = `http://localhost/api/books/${exampleBook.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const description = 'An updated description';
    const req = new NextRequest(reqURL, {
      method: 'PATCH',
      body: JSON.stringify({ description }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH_BOOK(req, reqParams);

    expect(res.status).toEqual(200);
    const json = await res.json();
    expect(json.description).toEqual(description);
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

describe('POST /api/books/:bookId/locations', async () => {
  it('adds a location to book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const exampleCountry = await insertLocation(exampleCountryReq, null);
    const formData = new FormData();
    formData.append('locationId', exampleCountry.id);
    const reqURL = `http://localhost/api/books/${exampleBook.id}/locations`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id }) };
    const postReq = new NextRequest(reqURL, {
      method: 'POST',
      body: formData
    });
    const postRes = await POST_BOOK_LOCATION(postReq, reqParams);
    expect(postRes.status).toEqual(201);
    expect(await postRes.json()).toEqual({ bookId: exampleBook.id, locationId: exampleCountry.id });

    const getReq = new NextRequest(reqURL);
    const getRes = await GET_BOOK_LOCATIONS(getReq, reqParams);
    expect(getRes.status).toEqual(200);
    expect(await getRes.json()).toEqual([exampleCountry]);
  });
});

describe('DELETE /api/books/:bookId/locations/:locationId', async () => {
  it('removes a location from a book', async () => {
    const exampleBook = await insertBook(exampleBookReq);
    const exampleCountry = await insertLocation(exampleCountryReq, null);
    await insertBookLocation(exampleBook, exampleCountry);

    const reqURL = `http://localhost/api/books/${exampleBook.id}/locations/${exampleCountry.id}`;
    const reqParams = { params: Promise.resolve({ bookId: exampleBook.id, locationId: exampleCountry.id }) };
    const req = new NextRequest(reqURL, { method: 'DELETE' });
    const res = await DELETE_BOOK_LOCATION(req, reqParams);
    expect(res.status).toEqual(204);

    const getReq = new NextRequest(`http://localhost/api/books/${exampleBook.id}/locations`);
    const getRes = await GET_BOOK_LOCATIONS(getReq, { params: Promise.resolve({ bookId: exampleBook.id }) });
    expect(await getRes.json()).toEqual([]);
  });
});

describe('GET /api/books', async () => {
  it('searches for book titles and authors based on query', async () => {
    const exampleBook = await insertBook({
      ...exampleBookReq,
      title: "Query Book Title"
    });
    const exampleBook2 = await insertBook({
      ...exampleBookReq2,
      author: "John Smith"
    });

    let reqURL = `http://localhost/api/books?q=query`;
    let req = new NextRequest(reqURL);
    let res = await QUERY_BOOK(req);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([exampleBook]);

    reqURL = `http://localhost/api/books?q=John`;
    req = new NextRequest(reqURL);
    res = await QUERY_BOOK(req);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([exampleBook2]);
  });
});
