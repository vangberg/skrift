import BetterSqlite3 from "better-sqlite3";
import { NotesDB, NoteNotFoundError } from "./index.js";

describe("NotesDB.delete()", () => {
  let db: BetterSqlite3.Database;

  beforeAll(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  it("deletes a note", () => {
    NotesDB.save(
      db,
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      new Date()
    );

    NotesDB.delete(db, "a.md");
    expect(() => NotesDB.get(db, "a.md")).toThrow(NoteNotFoundError);
  });
});
