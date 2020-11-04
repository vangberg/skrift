import { SCache } from "../../../src/interfaces/scache";

describe("SCache.claim", () => {
  it("sets initial claim", () => {
    let cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, value: null });
  });

  it("sets initial claim with default value", () => {
    let cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a", "default");

    expect(cache.get("a")).toEqual({ claims: 1, value: "default" });
  });

  it("increases existing claims", () => {
    let cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a");
    SCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 2, value: null });
  });

  it("increases existing claims without overriding default value", () => {
    let cache: SCache<string, null> = new Map();

    SCache.claim(cache, "a", "default");
    SCache.claim(cache, "a", "later default");

    expect(cache.get("a")).toEqual({ claims: 2, value: "default" });
  });
});
