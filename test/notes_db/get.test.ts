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
    await NotesDB.save(db, "a", "# Added note");

    const result = await NotesDB.get(db, "a");
    expect(result.id).toEqual("a");
    expect(result.title).toEqual("Added note");
  });
});
