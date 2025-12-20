import { exampleCountry, exampleState } from '@/app/__tests__/fixtures';
import { insertLocation } from '@/app/__tests__/helpers';
import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /locations', async () => {
  it('gets all locations', async () => {
    await insertLocation(exampleCountry);
    await insertLocation(exampleState);
    const res = await (await GET()).json();
    expect(res).toContainEqual(exampleCountry);
    expect(res).toContainEqual(exampleState);
  });
});