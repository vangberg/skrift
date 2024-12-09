import { SCache } from "../../../src/skrift/scache";

describe("SCache.release", () => {
  it("decreases claims", () => {
    const cache: SCache<null> = {
      a: { claims: 2, value: null },
    };

    SCache.release(cache, "a");

    expect(cache["a"]).toEqual({ claims: 1, value: null });
  });

  it("removes entry when there are no claims", () => {
    const cache: SCache<null> = {
      a: { claims: 1, value: null },
    };

    SCache.release(cache, "a");

    expect(cache["a"]).toEqual(undefined);
  });
});
