import { describe, expect, it, beforeEach } from "vitest";

import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from "./index.js";

describe("NotesDB.semanticSearch()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(async () => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
    await NotesDB.save(db, "a.md", "Monkey eating bananas in the jungle");
    await NotesDB.save(db, "b.md", "Tiger hunting in the jungle");
    await NotesDB.save(db, "c.md", "Programming in Python and JavaScript");
  });

  it("returns semantically similar results", async () => {
    const results = await NotesDB.searchSemantic(db, "wild animals in nature");
    expect(results).toContain("a.md");
    expect(results).toContain("b.md");
    expect(results).not.toContain("c.md");
  });

  it("returns results ordered by relevance", async () => {
    const results = await NotesDB.searchSemantic(db, "dangerous predator");
    expect(results[0]).toBe("b.md"); // Tiger should be most relevant
  });

  it("respects the topK parameter", async () => {
    const results = await NotesDB.searchSemantic(db, "animals", 1);
    expect(results).toHaveLength(1);
  });

  it("handles empty query", async () => {
    const results = await NotesDB.searchSemantic(db, "");
    expect(results).toHaveLength(0);
  });

  it("handles query with no semantic matches", async () => {
    const results = await NotesDB.searchSemantic(db, "xyzabc123");
    expect(results).toHaveLength(0);
  });
});
