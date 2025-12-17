import { describe, expect, it } from "vitest";
import { exampleBook } from "../__tests__/fixtures";
import { GET } from "./books/random/route";

describe('/api/books/random', async () => {
  it('gets a random book', async () => {
    // insert book into db

    const res = await GET();
    expect(await res.json()).toEqual(exampleBook);
  });
});