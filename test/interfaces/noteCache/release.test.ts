import { Cache } from "../../../src/interfaces/cache";

describe("Cache.release", () => {
  it("decreases claims", () => {
    let cache: Cache<string, null> = new Map([
      ["a", { claims: 2, value: null }],
    ]);

    Cache.release(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, value: null });
  });

  it("removes entry when there are no claims", () => {
    let cache: Cache<string, null> = new Map([
      ["a", { claims: 1, value: null }],
    ]);

    Cache.release(cache, "a");

    expect(cache.has("a")).toEqual(false);
  });
});
