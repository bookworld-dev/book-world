import { NextRequest, NextResponse } from 'next/server';
import * as bookController from './book.controller';
import { BookAPIRequest } from '@/app/lib/types';
import { InvalidParamsError } from '../errors';

const validateParamTypes = (formData: FormData): BookAPIRequest => {
  const title = formData.get('title');
  const author = formData.get('author');
  const cover = formData.get('cover');

  if (typeof title !== 'string') throw new InvalidParamsError('Invalid title');
  if (typeof author !== 'string') throw new InvalidParamsError('Invalid author');
  if (!(cover instanceof File) || !cover.type.startsWith('image/')) 
    throw new InvalidParamsError('Invalid cover');

  return { title, author, cover };
}

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  try {
    const bookReq = validateParamTypes(formData);
    const book = await bookController.createBook(bookReq);
    return NextResponse.json(book, { status: 201 });
  } catch(e) {
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    );
  }
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query) return NextResponse.json([], {status: 200});
  return NextResponse.json(await bookController.queryBooks(query));
}