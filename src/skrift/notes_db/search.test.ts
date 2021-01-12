import { Database } from "sqlite";
import { NotesDB, NoteRow, LinkRow } from ".";

describe("NotesDB.search()", () => {
  let db: Database;

  beforeEach(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
    await NotesDB.save(db, "a", "Monkey");
    await NotesDB.save(db, "b", "Tiger");
  });

  it("returns search results", async () => {
    const notes = await NotesDB.search(db, "Tiger");

    expect(notes).toEqual(["b"]);
  });

  it("returns all results", async () => {
    const notes = await NotesDB.search(db, "*");

    expect(notes.sort()).toEqual(["a", "b"].sort());
  });

  it("ignores special characters", async () => {
    const notes = await NotesDB.search(db, "Tiger #");

    expect(notes).toEqual(["b"]);
  });
});
