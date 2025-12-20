import { NextResponse } from 'next/server';
import * as locationController from './location.controller';

export async function GET() {
  return NextResponse.json(await locationController.getLocations());
}