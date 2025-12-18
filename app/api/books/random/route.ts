import { NextResponse } from 'next/server';
import * as bookController from '../book.controller';
import { BookNotFoundError } from '../book.errors';

export async function GET() {
  try {
    const book = await bookController.getRandomBook();
    return NextResponse.json(book);
  } catch (err) {
    if (err instanceof BookNotFoundError) {
      return NextResponse.json(
        { error: err.message },
        { status: 404 }
      );
    }

    throw err;
  }
}