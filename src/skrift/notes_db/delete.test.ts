import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB, NoteNotFoundError } from "./index.js";

describe("NotesDB.delete()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  test("deletes a note", async () => {
    await NotesDB.save(
      db,
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      new Date()
    );

    NotesDB.delete(db, "a.md");
    expect(() => NotesDB.get(db, "a.md")).toThrow(NoteNotFoundError);
  });
});
