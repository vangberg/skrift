import path from "node:path";
import { NotesFS } from "./index.js";

const PATH = new URL("fixtures", import.meta.url).pathname

describe("NotesFS.read", () => {
  it("reads note", async () => {
    const note = await NotesFS.read(PATH, "1.md");

    expect(note.title).toEqual("Note 1");
  });
});
