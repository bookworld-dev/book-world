import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../book.controller';

type Params = {
  params: {
    bookId: string;
  };
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  return NextResponse.json({});
}

export const GET = async (_req: NextRequest, { params }: Params) => {
  return NextResponse.json(await bookController.getBookById(params.bookId));
}