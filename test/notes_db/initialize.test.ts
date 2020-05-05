import { Database } from "sqlite3";
import { NotesDB } from "../../src/interfaces/notes_db";

describe("NotesDB.initialize()", () => {
  const db = new Database(":memory:");
  NotesDB.initialize(db);

  it("creates a notes table", (done) => {
    db.get(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'notes'`,
      (_, row) => {
        expect(row).toBeTruthy();
        done();
      }
    );
  });

  it("creates a links table", (done) => {
    db.get(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'links'`,
      (_, row) => {
        expect(row).toBeTruthy();
        done();
      }
    );
  });
});
