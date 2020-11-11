import { NotesDB } from ".";
import { Database } from "sqlite";

describe("NotesDB.initialize()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("creates a notes table", async () => {
    const row = await db.get(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'notes'`
    );

    expect(row).toBeTruthy();
  });

  it("creates a links table", async () => {
    const row = await db.get(
      `SELECT * FROM sqlite_master WHERE type = 'table' AND name = 'links'`
    );
    expect(row).toBeTruthy();
  });
});
