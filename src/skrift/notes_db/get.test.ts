import { Database } from "sqlite";
import { NotesDB, NoteNotFoundError } from ".";

describe("NotesDB.get()", () => {
  let db: Database;

  beforeAll(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("gets a note", async () => {
    const date = new Date();
    await NotesDB.save(db, "a", "# Added note\n\nLinks: [[b]], [[c]]", date);

    const result = await NotesDB.get(db, "a");
    expect(result.id).toEqual("a");
    expect(result.title).toEqual("Added note");
    expect(result.links).toEqual(new Set(["b", "c"]));
    expect(result.modifiedAt).toEqual(date);
  });

  it("gets backlinks", async () => {
    const date = new Date();
    await NotesDB.save(db, "a", "[[b]]", date);
    await NotesDB.save(db, "b", "# B", date);

    const result = await NotesDB.get(db, "b");
    expect(result.backlinks).toEqual(new Set(["a"]));
  });

  it("fails on unknown note", async () => {
    await expect(NotesDB.get(db, "unknown")).rejects.toThrow(NoteNotFoundError);
  });
});
