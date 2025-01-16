import path from "node:path";
import { NotesFS } from "./index.js";

const PATH = path.join(__dirname, "fixtures");

describe("NotesFS.read", () => {
  it("reads note", async () => {
    const note = await NotesFS.read(PATH, "1.md");

    expect(note.title).toEqual("Note 1");
  });
});
