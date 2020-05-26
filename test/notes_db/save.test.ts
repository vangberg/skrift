import { Database } from "sqlite";
import { NotesDB, NoteRow } from "../../src/interfaces/notes_db";
import { Note } from "../../src/interfaces/note";

describe("NotesDB.save()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("inserts a new note", async () => {
    await NotesDB.save(db, "a", "# Added note");

    const rows = await db.all<NoteRow[]>(
      `SELECT * FROM notes WHERE title = 'Added note'`
    );
    expect(rows.length).toEqual(1);
  });

  it("updates an existing note", async () => {
    await NotesDB.save(db, "a", "New note");
    await NotesDB.save(db, "a", "Updated note");

    const rows = await db.all<NoteRow[]>(`SELECT * FROM notes WHERE id = 'a'`);
    expect(rows.length).toEqual(1);
    expect(rows[0].title).toEqual("Updated note");
  });
});
