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
    const note = Note.empty({ title: "Added note" });
    await NotesDB.save(db, note);

    const rows = await db.all<NoteRow[]>(
      `SELECT * FROM notes WHERE title = 'Added note'`
    );
    expect(rows.length).toEqual(1);
  });

  it("updates an existing note", async () => {
    const note = Note.empty({ id: "a", title: "New note" });
    await NotesDB.save(db, note);

    note.title = "Updated note";
    await NotesDB.save(db, note);

    const rows = await db.all<NoteRow[]>(`SELECT * FROM notes WHERE id = 'a'`);
    expect(rows.length).toEqual(1);
    expect(rows[0].title).toEqual("Updated note");
  });
});
