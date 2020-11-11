import path from "path";
import { NotesFS } from ".";
import { Note } from "../note";

const PATH = path.join(__dirname, "../fixtures");

describe("NotesFS.readDir", () => {
  it("reads notes one at a time", async () => {
    const generator = NotesFS.readDir(PATH);
    const result = await generator.next();

    expect(result.done).toEqual(false);

    const value = result.value as Note;
    expect(value.title).toEqual("Note 1");
  });

  it("reads all notes", async () => {
    const notes = [];

    for await (let note of NotesFS.readDir(PATH)) {
      notes.push(note);
    }

    expect(notes.length).toEqual(3);
    expect(notes.map((n) => n.title)).toEqual(["Note 1", "Note 2", "Note 3"]);
  });
});
