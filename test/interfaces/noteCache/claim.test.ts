import { Cache } from "../../../src/interfaces/cache";

describe("Cache.claim", () => {
  it("sets initial claim", () => {
    let cache: Cache<string, null> = new Map();

    Cache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, value: null });
  });

  it("increases existing claims", () => {
    let cache: Cache<string, null> = new Map();

    Cache.claim(cache, "a");
    Cache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 2, value: null });
  });
});
