import { describe, expect, test } from 'vitest';
import { SCache } from "./index.js";

describe("SCache.claim", () => {
  test("sets initial claim", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a");

    expect(cache["a"]).toEqual({ claims: 1, value: null });
  });

  test("sets initial claim with default value", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a", "default");

    expect(cache["a"]).toEqual({ claims: 1, value: "default" });
  });

  test("increases existing claims", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a");
    SCache.claim(cache, "a");

    expect(cache["a"]).toEqual({ claims: 2, value: null });
  });

  test("increases existing claims without overriding default value", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a", "default");
    SCache.claim(cache, "a", "later default");

    expect(cache["a"]).toEqual({ claims: 2, value: "default" });
  });
});
