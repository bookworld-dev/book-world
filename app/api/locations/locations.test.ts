import { exampleCountryReq, exampleStateReq } from '@/app/__tests__/fixtures';
import { describe, expect, it } from 'vitest';
import { GET } from './route';
import { insertLocation } from '@/app/__tests__/helpers';

describe('GET /locations', async () => {
  it('gets all locations', async () => {
    const country = await insertLocation(exampleCountryReq, null);
    const state = await insertLocation(exampleStateReq, country.id);
    const res = await (await GET()).json();
    expect(res).toContainEqual(country);
    expect(res).toContainEqual(state);
  });
});