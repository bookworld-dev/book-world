import { BookLocation, PromisedBookParams } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getLocationsByBookId } from "@/app/api/locations/location.controller";
import { createBookLocation } from "../../book.controller";
import { InvalidParamsError } from "@/app/api/errors";

export const GET = async (_req: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  return NextResponse.json(await getLocationsByBookId(bookId));
}

const validateLocationId = (formData: FormData): string => {
  const locationId = formData.get('locationId');
  if (typeof locationId !== 'string') throw new InvalidParamsError('Invalid location ID');
  return locationId;
}

export const POST = async (request: NextRequest, { params }: PromisedBookParams) => {
  const locationId = validateLocationId(await request.formData());
  const { bookId } = await params;
  const bookLocation = { bookId, locationId };
  await createBookLocation(bookLocation);
  return NextResponse.json(bookLocation, { status: 201 });
}