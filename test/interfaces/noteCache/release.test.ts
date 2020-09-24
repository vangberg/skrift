import { NoteCache } from "../../../src/interfaces/noteCache";

describe("NoteCache.release", () => {
  it("decreases claims", () => {
    let cache: NoteCache = new Map([["a", { claims: 2, note: null }]]);

    NoteCache.release(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, note: null });
  });

  it("removes entry when there are no claims", () => {
    let cache: NoteCache = new Map([["a", { claims: 1, note: null }]]);

    NoteCache.release(cache, "a");

    expect(cache.has("a")).toEqual(false);
  });
});
