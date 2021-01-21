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
    await NotesDB.save(
      db,
      "a.md",
      "# Added note\n\nLinks: [#](b.md), [#](c.md)",
      date
    );

    const result = await NotesDB.get(db, "a.md");
    expect(result.id).toEqual("a.md");
    expect(result.title).toEqual("Added note");
    expect(result.linkIds).toEqual(new Set(["b.md", "c.md"]));
    expect(result.modifiedAt).toEqual(date);
  });

  it("gets a note with links", async () => {
    await NotesDB.save(db, "a.md", "Alpha\n\n[#](b.md) [#](c.md)");
    await NotesDB.save(db, "b.md", "Beta\n\n[#](a.md)");
    await NotesDB.save(db, "c.md", "Charlie");

    const result = await NotesDB.getWithLinks(db, "a.md");
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
    await NotesDB.save(db, "a.md", "[#](b.md)", date);
    await NotesDB.save(db, "b.md", "# B", date);

    const result = await NotesDB.get(db, "b.md");
    expect(result.backlinkIds).toEqual(new Set(["a.md"]));
  });

  it("fails on unknown note", async () => {
    await expect(NotesDB.get(db, "unknown")).rejects.toThrow(NoteNotFoundError);
  });
});
