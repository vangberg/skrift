import { NoteCache } from "../../../src/interfaces/noteCache";

describe("NoteCache.claim", () => {
  it("sets initial claim", () => {
    let cache: NoteCache = new Map();

    NoteCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 1, note: null });
  });

  it("increases existing claims", () => {
    let cache: NoteCache = new Map();

    NoteCache.claim(cache, "a");
    NoteCache.claim(cache, "a");

    expect(cache.get("a")).toEqual({ claims: 2, note: null });
  });
});
