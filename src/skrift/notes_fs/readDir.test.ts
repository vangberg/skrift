import { describe, test, beforeAll, beforeEach, afterEach, expect } from 'vitest';
import { NotesFS } from "./index.js";
import { Note } from "../note/index.js";

const PATH = new URL("fixtures", import.meta.url).pathname

describe("NotesFS.readDir", () => {
  test("reads notes one at a time", async () => {
    const generator = NotesFS.readDir(PATH);
    const result = await generator.next();

    expect(result.done).toEqual(false);

    const value = result.value as Note;
    expect(value.title).toEqual("Note 1");
  });

  test("reads all notes", async () => {
    const notes = [];

    for await (const note of NotesFS.readDir(PATH)) {
      notes.push(note);
    }

    expect(notes.length).toEqual(3);
    expect(notes.map((n) => n.title)).toEqual(["Note 1", "Note 2", "Note 3"]);
  });
});
