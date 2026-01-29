import { NextRequest, NextResponse } from "next/server";
import * as bookController from '../../../books/book.controller';
import { PromisedLocationParams } from "@/app/lib/types";

export const GET = async (_req: NextRequest, { params }: PromisedLocationParams) => {
  const { locationId } = await params;
  const books = await bookController.getBooksByLocationId(locationId);
  return NextResponse.json(books);
}