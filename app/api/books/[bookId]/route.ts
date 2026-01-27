import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../book.controller';
import { BookNotFoundError } from "../book.errors";

type Params = {
  bookId: string;
};

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<Params> }) => {
  const { bookId } = await params;
  await bookController.deleteBookById(bookId);
  return new Response(null, { status: 204 });
};


export const GET = async (_req: NextRequest, { params }: { params: Promise<Params> }) => {
  try {
    const { bookId } = await params;
    const book = await bookController.getBookById(bookId);
    return NextResponse.json(book);
  } catch (e) {
    if (e instanceof BookNotFoundError) {
      return NextResponse.json(
        { error: e.message },
        { status: 404 }
      );
    }
    throw e;
  }
};