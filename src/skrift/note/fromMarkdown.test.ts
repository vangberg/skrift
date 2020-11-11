import { Note } from ".";

const fullNote = `# A title

Some content. [[123]].
Another link: [[456]]`;

describe("parseMarkdown", () => {
  describe("with full note", () => {
    const note = Note.fromMarkdown(fullNote);

    it("parses title", () => {
      expect(note.title).toEqual("A title");
    });

    it("parses body", () => {
      expect(note.body).toEqual(
        "Some content. [[123]].\nAnother link: [[456]]"
      );
    });

    it("parses links", () => {
      expect(note.links).toEqual(new Set(["123", "456"]));
    });
  });
});

export default {};
