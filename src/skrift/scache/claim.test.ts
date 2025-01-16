import { SCache } from "./index.js";

describe("SCache.claim", () => {
  it("sets initial claim", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a");

    expect(cache["a"]).toEqual({ claims: 1, value: null });
  });

  it("sets initial claim with default value", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a", "default");

    expect(cache["a"]).toEqual({ claims: 1, value: "default" });
  });

  it("increases existing claims", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a");
    SCache.claim(cache, "a");

    expect(cache["a"]).toEqual({ claims: 2, value: null });
  });

  it("increases existing claims without overriding default value", () => {
    const cache: SCache<null> = {};

    SCache.claim(cache, "a", "default");
    SCache.claim(cache, "a", "later default");

    expect(cache["a"]).toEqual({ claims: 2, value: "default" });
  });
});
