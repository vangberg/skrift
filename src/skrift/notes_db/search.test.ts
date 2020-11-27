import { Database } from "sqlite";
import { NotesDB, NoteRow, LinkRow } from ".";
import { Serializer } from "../serializer";

describe("NotesDB.search()", () => {
  let db: Database;

  beforeEach(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
    await NotesDB.save(db, "a", Serializer.deserialize("Monkey"));
    await NotesDB.save(db, "b", Serializer.deserialize("Tiger"));
  });

  it("returns search results", async () => {
    const notes = await NotesDB.search(db, "Tiger");

    expect(notes).toEqual(["b"]);
  });

  it("returns all results", async () => {
    const notes = await NotesDB.search(db, "*");

    expect(notes).toEqual(["a", "b"]);
  });

  it("ignores special characters", async () => {
    const notes = await NotesDB.search(db, "Tiger #");

    expect(notes).toEqual(["b"]);
  });

  it("updates an existing note", async () => {
    await NotesDB.save(db, "a", Serializer.deserialize("New note"));
    await NotesDB.save(db, "a", Serializer.deserialize("Updated note"));

    const rows = await db.all<NoteRow[]>(`SELECT * FROM notes WHERE id = 'a'`);
    expect(rows.length).toEqual(1);
    expect(rows[0].title).toEqual("Updated note");
  });

  it("inserts new links", async () => {
    await NotesDB.save(db, "a", Serializer.deserialize("[[b]] [[c]]"));

    const rows = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE fromId = 'a'`
    );
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b", "c"]);
  });

  it("deletes and updates existing links", async () => {
    await NotesDB.save(db, "a", Serializer.deserialize("[[b]] [[c]]"));
    await NotesDB.save(db, "a", Serializer.deserialize("[[b]] [[d]]"));

    const rows = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE fromId = 'a'`
    );
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b", "d"]);
  });
});
