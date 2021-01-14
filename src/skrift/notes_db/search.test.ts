import { Database } from "sqlite";
import { NotesDB, NoteRow, LinkRow } from ".";

describe("NotesDB.search()", () => {
  let db: Database;

  beforeEach(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
    await NotesDB.save(db, "a.md", "Monkey");
    await NotesDB.save(db, "b.md", "Tiger");
  });

  it("returns search results", async () => {
    const notes = await NotesDB.search(db, "Tiger");

    expect(notes).toEqual(["b.md"]);
  });

  it("returns all results", async () => {
    const notes = await NotesDB.search(db, "*");

    expect(notes.sort()).toEqual(["a.md", "b.md"].sort());
  });

  it("ignores special characters", async () => {
    const notes = await NotesDB.search(db, "Tiger #");

    expect(notes).toEqual(["b.md"]);
  });
});
