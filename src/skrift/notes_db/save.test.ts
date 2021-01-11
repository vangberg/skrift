import { Database } from "sqlite";
import { NotesDB, NoteRow, LinkRow } from ".";
import { Serializer } from "../serializer";

describe("NotesDB.save()", () => {
  let db: Database;

  beforeEach(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("inserts a new note", async () => {
    await NotesDB.save(db, "a", Serializer.deserialize("# Added note"));

    const rows = await db.all<NoteRow[]>(
      `SELECT * FROM notes WHERE title = 'Added note'`
    );
    expect(rows.length).toEqual(1);
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