import { NextRequest, NextResponse } from 'next/server';
import * as bookController from '../book.controller';
import { BookNotFoundError } from '../../../lib/errors/book.errors';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location')
    const book = await bookController.getRandomBookByLocationCode(location!);
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