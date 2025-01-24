import { describe, test, expect } from "vitest";
import { SCache } from "./index.js";

describe("SCache.release", () => {
  test("decreases claims", () => {
    const cache: SCache<null> = {
      a: { claims: 2, value: null },
    };

    SCache.release(cache, "a");

    expect(cache["a"]).toEqual({ claims: 1, value: null });
  });

  test("removes entry when there are no claims", () => {
    const cache: SCache<null> = {
      a: { claims: 1, value: null },
    };

    SCache.release(cache, "a");

    expect(cache["a"]).toEqual(undefined);
  });
});
