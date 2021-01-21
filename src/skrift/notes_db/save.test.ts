import { Database } from "sqlite";
import { NotesDB, NoteRow, LinkRow } from ".";

describe("NotesDB.save()", () => {
  let db: Database;

  beforeEach(async () => {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
  });

  it("inserts a new note", async () => {
    await NotesDB.save(db, "a.md", "# Added note");

    const rows = await db.all<NoteRow[]>(
      `SELECT * FROM notes WHERE title = 'Added note'`
    );
    expect(rows.length).toEqual(1);
  });

  it("updates an existing note", async () => {
    await NotesDB.save(db, "a.md", "New note");
    await NotesDB.save(db, "a.md", "Updated note");

    const rows = await db.all<NoteRow[]>(
      `SELECT * FROM notes WHERE id = 'a.md'`
    );
    expect(rows.length).toEqual(1);
    expect(rows[0].title).toEqual("Updated note");
  });

  it("inserts new links", async () => {
    await NotesDB.save(db, "a.md", "[#](b.md) [#](c.md)");

    const rows = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE fromId = 'a.md'`
    );
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b.md", "c.md"]);
  });

  it("deletes and updates existing links", async () => {
    await NotesDB.save(db, "a.md", "[#](b.md) [#](c.md)");
    await NotesDB.save(db, "a.md", "[#](b.md) [#](d.md)");

    const rows = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE fromId = 'a.md'`
    );
    expect(rows.length).toEqual(2);
    expect(rows.map((row) => row.toId).sort()).toEqual(["b.md", "d.md"]);
  });
});
