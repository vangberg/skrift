import BetterSqlite3 from "better-sqlite3";
import { NotesDB, NoteNotFoundError } from ".";

describe("NotesDB.get()", () => {
  let db: BetterSqlite3.Database;

  beforeAll(() => {
    db = NotesDB.memory();
    NotesDB.initialize(db);
  });

  it("gets a note", () => {
    const date = new Date();
    NotesDB.save(
      db,
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      date
    );

    const result = NotesDB.get(db, "a.md");
    expect(result.id).toEqual("a.md");
    expect(result.title).toEqual("Added note");
    expect(result.linkIds).toEqual(new Set(["b.md", "c.md"]));
    expect(result.modifiedAt).toEqual(date);
  });

  it("gets a note with links", () => {
    NotesDB.save(db, "a.md", "Alpha\n\n[#](b.md) [#](c.md)");
    NotesDB.save(db, "b.md", "Beta\n\n[#](a.md)");
    NotesDB.save(db, "c.md", "Charlie");

    const result = NotesDB.getWithLinks(db, "a.md");
    expect(result.links.sort()).toEqual(
      [
        { id: "b.md", title: "Beta" },
        { id: "c.md", title: "Charlie" },
      ].sort()
    );
    expect(result.backlinks).toEqual([{ id: "b.md", title: "Beta" }]);
  });

  it("gets backlinks", async () => {
    const date = new Date();
    NotesDB.save(db, "a.md", "[#](b.md)", date);
    NotesDB.save(db, "b.md", "# B", date);

    const result = NotesDB.get(db, "b.md");
    expect(result.backlinkIds).toEqual(new Set(["a.md"]));
  });

  it("fails on unknown note", () => {
    expect(() => NotesDB.get(db, "unknown")).toThrow(NoteNotFoundError);
  });
});
