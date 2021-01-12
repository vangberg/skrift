import { Database } from "sqlite";
import { NotesDB, NoteNotFoundError } from ".";

describe("NotesDB.delete()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("deletes a note", async () => {
    await NotesDB.save(
      db,
      "a",
      "# Added note\n\nLinks: [[b]], [[c]]",
      new Date()
    );

    await NotesDB.delete(db, "a");
    await expect(NotesDB.get(db, "a")).rejects.toThrow(NoteNotFoundError);
  });
});
