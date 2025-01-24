import { describe, expect, test } from 'vitest';
import { Note } from "./index.js";

const fullNote = `# A title

Some content. [#](123.md).
Another link: [#](456.md)`;

describe("parseMarkdown", () => {
  describe("with full note", () => {
    const note = Note.fromMarkdown(fullNote);

    test("parses title", () => {
      expect(note.title).toEqual("A title");
    });

    test("parses body", () => {
      expect(note.body).toEqual(
        "Some content. [#](123.md).\nAnother link: [#](456.md)"
      );
    });

    test("parses links", () => {
      expect(note.linkIds).toEqual(new Set(["123.md", "456.md"]));
    });
  });
});

export default {};
