import { NextResponse } from 'next/server';
import * as bookController from '../book.controller';

export async function GET() {
  return NextResponse.json(await bookController.getRandomBook());
}