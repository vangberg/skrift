import path from "path";
import { NotesFS } from ".";

const PATH = path.join(__dirname, "fixtures");

describe("NotesFS.read", () => {
  it("reads note", async () => {
    const note = await NotesFS.read(PATH, "1");

    expect(note.title).toEqual("Note 1");
  });
});
