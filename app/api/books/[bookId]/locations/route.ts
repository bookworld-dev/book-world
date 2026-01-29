import { PromisedBookParams } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getLocationsByBookId } from "@/app/api/locations/location.controller";

export const GET = async (request: NextRequest, { params }: PromisedBookParams) => {
  const { bookId } = await params;
  return NextResponse.json(await getLocationsByBookId(bookId));
}

export const POST = async (request: NextRequest, { params }: PromisedBookParams) => {
  return NextResponse.json({});
}