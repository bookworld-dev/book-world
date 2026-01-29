import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../book.controller';
import { BookNotFoundError } from "../book.errors";
import { PromisedBookParams } from "@/app/lib/types";

export const DELETE = async (_req: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  await bookController.deleteBookById(bookId);
  return new Response(null, { status: 204 });
};

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