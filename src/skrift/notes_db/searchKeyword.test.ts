import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from "./index.js";

describe("NotesDB.searchKeyword()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(async () => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
    await NotesDB.save(db, "a.md", "Monkey");
    await NotesDB.save(db, "b.md", "Tiger");
  });

  test("returns search results", async () => {
    const notes = await NotesDB.searchKeyword(db, "Tiger");

    expect(notes).toEqual(["b.md"]);
  });

  test("returns all results", async () => {
    const notes = await NotesDB.searchKeyword(db, "*");

    expect(notes.sort()).toEqual(["a.md", "b.md"].sort());
  });

  test("ignores special characters", async () => {
    const notes = await NotesDB.searchKeyword(db, "Tiger #");

    expect(notes).toEqual(["b.md"]);
  });
});
