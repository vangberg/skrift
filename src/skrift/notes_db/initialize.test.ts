import { describe, beforeAll, expect, test } from 'vitest';
import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from "./index.js";

describe("NotesDB.initialize()", () => {
  let db: BetterSqlite3.Database;

  beforeAll(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  test("creates a notes table", () => {
    const row = db.prepare(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'notes'`
    ).run();

    expect(row).toBeTruthy();
  });

  test("creates a links table", () => {
    const row = db.prepare(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'links'`
    ).run();

    expect(row).toBeTruthy();
  });
});
