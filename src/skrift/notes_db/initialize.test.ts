import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from ".";

describe("NotesDB.initialize()", () => {
  let db: BetterSqlite3.Database;

  beforeAll(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  it("creates a notes table", () => {
    const row = db.prepare(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'notes'`
    ).run();

    expect(row).toBeTruthy();
  });

  it("creates a links table", () => {
    const row = db.prepare(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'links'`
    ).run();

    expect(row).toBeTruthy();
  });
});
