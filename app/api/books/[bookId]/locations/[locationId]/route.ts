import { PromisedBookLocationParams } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { deleteBookLocation } from "../../../book.controller";

export const DELETE = async (_req: NextRequest, { params }: PromisedBookLocationParams) => {
  const { bookId, locationId } = await params;
  await deleteBookLocation(bookId, locationId);
  return new NextResponse(null, { status: 204 });
}
