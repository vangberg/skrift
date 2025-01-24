import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB, NoteNotFoundError } from "./index.js";

describe("NotesDB.get()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  test("gets a note", async () => {
    const date = new Date();
    await NotesDB.save(
      db,
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      date
    );

    const result = NotesDB.get(db, "a.md");
    expect(result.id).toEqual("a.md");
    expect(result.title).toEqual("Added note");
    expect(result.linkIds).toEqual(new Set(["b.md", "c.md"]));
    expect(result.modifiedAt).toEqual(date);
  });

  test("gets a note with links", async () => {
    await NotesDB.save(db, "a.md", "Alpha\n\n[#](b.md) [#](c.md)");
    await NotesDB.save(db, "b.md", "Beta\n\n[#](a.md)");
    await NotesDB.save(db, "c.md", "Charlie");

    const result = NotesDB.getWithLinks(db, "a.md");
    expect(result.links.sort()).toEqual(
      [
        { id: "b.md", title: "Beta" },
        { id: "c.md", title: "Charlie" },
      ].sort()
    );
    expect(result.backlinks).toEqual([{ id: "b.md", title: "Beta" }]);
  });

  test("gets backlinks", async () => {
    const date = new Date();
    await NotesDB.save(db, "a.md", "[#](b.md)", date);
    await NotesDB.save(db, "b.md", "# B", date);

    const result = NotesDB.get(db, "b.md");
    expect(result.backlinkIds).toEqual(new Set(["a.md"]));
  });

  test("fails on unknown note", () => {
    expect(() => NotesDB.get(db, "unknown")).toThrow(NoteNotFoundError);
  });
});
