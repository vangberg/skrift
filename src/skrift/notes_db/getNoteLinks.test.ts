import BetterSqlite3 from "better-sqlite3";
import { NotesDB } from ".";

describe("NotesDB.getNoteLinks()", () => {
  let db: BetterSqlite3.Database;

  beforeAll(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  it("gets note links in specified order", () => {
    const date = new Date();
    NotesDB.save(db, "a.md", "A", date);
    NotesDB.save(db, "b.md", "B", date);

    const result = NotesDB.getNoteLinks(db, ["b.md", "a.md"]);

    expect(result.map((r) => r.id)).toEqual(["b.md", "a.md"]);
  });
});
