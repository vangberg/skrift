import { SCache } from ".";

describe("SCache.claim", () => {
  it("sets initial claim", () => {
    const cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, value: null });
  });

  it("sets initial claim with default value", () => {
    const cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a", "default");

    expect(cache.get("a")).toEqual({ claims: 1, value: "default" });
  });

  it("increases existing claims", () => {
    const cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a");
    SCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 2, value: null });
  });

  it("increases existing claims without overriding default value", () => {
    const cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a", "default");
    SCache.claim(cache, "a", "later default");

    expect(cache.get("a")).toEqual({ claims: 2, value: "default" });
  });
});
