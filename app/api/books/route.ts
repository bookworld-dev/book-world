import { NextRequest, NextResponse } from 'next/server';
import * as bookController from './book.controller';
import { BookAPIRequest } from '@/app/lib/types';
import { InvalidParamsError } from '../errors';

const validateParamTypes = (formData: FormData): BookAPIRequest => {
  const title = formData.get('title');
  const author = formData.get('author');
  const cover = formData.get('cover');
  const description = formData.get('description');

  if (typeof title !== 'string') throw new InvalidParamsError('Invalid title');
  if (typeof author !== 'string') throw new InvalidParamsError('Invalid author');
  if (!(cover instanceof File) || !cover.type.startsWith('image/'))
    throw new InvalidParamsError('Invalid cover');

  return { title, author, cover, description: typeof description === 'string' ? description : undefined };
}

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  let bookReq;
  try {
    bookReq = validateParamTypes(formData);
  } catch(e) {
    return NextResponse.json({ message: e instanceof Error ? e.message : 'Invalid payload' }, { status: 400 });
  }
  const book = await bookController.createBook(bookReq);
  return NextResponse.json(book, { status: 201 });
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query) return NextResponse.json([], {status: 200});
  return NextResponse.json(await bookController.queryBooks(query));
}