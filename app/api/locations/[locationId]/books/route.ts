import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../../../books/book.controller';

type Params = {
  params: {
    locationId: string;
  };
};

export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const books = await bookController.getBooksByLocationId(params.locationId);

  return NextResponse.json(books);
}