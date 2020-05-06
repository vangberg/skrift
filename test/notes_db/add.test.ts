import { Database } from "sqlite";
import { NotesDB } from "../../src/interfaces/notes_db";
import { Note } from "../../src/interfaces/note";

describe("NotesDB.add()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("adds a note", async () => {
    const note = Note.empty({ title: "Added note" });
    await NotesDB.add(db, note);

    const rows = await db.all(`SELECT * FROM notes WHERE title = 'Added note'`);
    expect(rows.length).toEqual(1);
  });
});
