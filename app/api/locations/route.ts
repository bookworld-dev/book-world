import { NextRequest, NextResponse } from 'next/server';
import * as locationController from './location.controller';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const populated = searchParams.get('populated')
  return NextResponse.json(await locationController.getLocations(populated!));
}