import { SCache } from "../../../src/skrift/scache";

describe("SCache.release", () => {
  it("decreases claims", () => {
    let cache: SCache<string, null> = new Map([
      ["a", { claims: 2, value: null }],
    ]);

    SCache.release(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, value: null });
  });

  it("removes entry when there are no claims", () => {
    let cache: SCache<string, null> = new Map([
      ["a", { claims: 1, value: null }],
    ]);

    SCache.release(cache, "a");

    expect(cache.has("a")).toEqual(false);
  });
});
