import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB, NoteRow, LinkRow } from "./index.js";

describe("NotesDB.save()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  test("inserts a new note", async () => {
    await NotesDB.save(db, "a.md", "# Added note");

    const rows = db.prepare<string, NoteRow>(
      `SELECT * FROM notes WHERE title = ?`
    ).all("Added note");
    expect(rows.length).toEqual(1);
  });

  test("updates an existing note", async () => {
    await NotesDB.save(db, "a.md", "New note");
    await NotesDB.save(db, "a.md", "Updated note");

    const rows = db.prepare<string, NoteRow>(
      `SELECT * FROM notes WHERE id = ?`
    ).all("a.md");
    expect(rows.length).toEqual(1);
    expect(rows[0].title).toEqual("Updated note");
  });

  test("inserts new links", async () => {
    await NotesDB.save(db, "a.md", "[#](b.md) [#](c.md)");

    const rows = db.prepare<string, LinkRow>(
      `SELECT * FROM links WHERE fromId = ?`
    ).all("a.md");
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b.md", "c.md"]);
  });

  test("deletes and updates existing links", async () => {
    await NotesDB.save(db, "a.md", "[#](b.md) [#](c.md)");
    await NotesDB.save(db, "a.md", "[#](b.md) [#](d.md)");

    const rows = db.prepare<string, LinkRow>(
      `SELECT * FROM links WHERE fromId = ?`
    ).all("a.md");
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b.md", "d.md"]);
  });
});
