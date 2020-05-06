import { Database } from "sqlite";
import { NotesDB, NoteRow } from "../../src/interfaces/notes_db";
import { Note } from "../../src/interfaces/note";

describe("NotesDB.get()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("gets a note", async () => {
    const note = Note.empty({
      id: "a",
      title: "Added note",
      markdown: "# Added note",
      modifiedAt: new Date(),
    });
    await NotesDB.save(db, note);

    const result = await NotesDB.get(db, "a");
    expect(result).toEqual(note);
  });
});
