import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../book.controller';
import { BookNotFoundError } from "../../../lib/errors/book.errors";
import { PromisedBookParams } from "@/app/lib/types";

export const GET = async (_req: NextRequest, { params }: PromisedBookParams) => {
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

export const PATCH = async (req: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof body.description !== 'string') {
    return NextResponse.json({ message: 'Invalid description' }, { status: 400 });
  }
  const book = await bookController.updateBookDescription(bookId, body.description);
  return NextResponse.json(book);
};

export const DELETE = async (_req: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  await bookController.deleteBookById(bookId);
  return new Response(null, { status: 204 });
};