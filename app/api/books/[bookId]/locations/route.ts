import { NextRequest, NextResponse } from "next/server";

type Params = {
  bookId: string;
};

export const POST = async (request: NextRequest, { params }: { params: Promise<Params> }) => {
  return NextResponse.json({});
}