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
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      new Date()
    );

    await NotesDB.delete(db, "a.md");
    await expect(NotesDB.get(db, "a.md")).rejects.toThrow(NoteNotFoundError);
  });
});
