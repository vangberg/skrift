import { Database } from "sqlite";
import { NotesDB, NoteNotFoundError } from ".";

describe("NotesDB.getNoteLinks()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("gets note links in specified order", async () => {
    const date = new Date();
    await NotesDB.save(db, "a.md", "A", date);
    await NotesDB.save(db, "b.md", "B", date);

    const result = await NotesDB.getNoteLinks(db, ["b.md", "a.md"]);

    expect(result.map((r) => r.id)).toEqual(["b.md", "a.md"]);
  });
});
