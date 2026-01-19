import { describe, expect, it } from 'vitest';
import { exampleBookReq, exampleCountryReq, exampleStateReq } from '../../__tests__/fixtures';
import { GET } from './random/route';
import { insertBook, insertBookLocation, insertLocation } from '../../__tests__/helpers';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { title } from 'process';
import { DELETE, GET as GET_BOOK } from './[bookId]/route';

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
    const res = await POST(req);
    
    const json = await res.json();
    expect(json.id).not.toEqual(undefined)
    expect(json.author).toEqual(exampleBookReq.author);
    expect(json.title).toEqual(exampleBookReq.title);
    expect(json.coverUrl).not.toEqual(undefined)
  });
});

describe('GET /api/books/:bookId', async () => {
  it('gets a book', async () => {
        const exampleBook = await insertBook(exampleBookReq);
        const reqURL = `http://localhost/api/books/${exampleBook.id}`;
        const reqParams = {params: { bookId: exampleBook.id }};
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

// describe('DELETE /api/books/:bookId', async () => {
//   it('deletes a book', async () => {
//     const exampleBook = await insertBook(exampleBookReq);
//     const reqURL = `http://localhost/api/books/${exampleBook.id}`;
//     const reqParams = {params: { bookId: exampleBook.id }};
//     const req = new NextRequest(reqURL);
//     const res = await DELETE(req, reqParams);
//     expect(res.status).toEqual(204);
//   });
// });