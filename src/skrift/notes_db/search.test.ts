import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from "./index.js";

describe("NotesDB.search()", () => {
  let db: BetterSqlite3.Database;

  beforeEach(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
    NotesDB.save(db, "a.md", "Monkey");
    NotesDB.save(db, "b.md", "Tiger");
  });

  test("returns search results", () => {
    const notes = NotesDB.search(db, "Tiger");

    expect(notes).toEqual(["b.md"]);
  });

  test("returns all results", () => {
    const notes = NotesDB.search(db, "*");

    expect(notes.sort()).toEqual(["a.md", "b.md"].sort());
  });

  test("ignores special characters", () => {
    const notes = NotesDB.search(db, "Tiger #");

    expect(notes).toEqual(["b.md"]);
  });
});
