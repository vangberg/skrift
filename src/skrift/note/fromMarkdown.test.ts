import { Note } from ".";

const fullNote = `# A title

Some content. [#](123.md).
Another link: [#](456.md)`;

describe("parseMarkdown", () => {
  describe("with full note", () => {
    const note = Note.fromMarkdown(fullNote);

    it("parses title", () => {
      expect(note.title).toEqual("A title");
    });

    it("parses body", () => {
      expect(note.body).toEqual(
        "Some content. [#](123.md).\nAnother link: [#](456.md)"
      );
    });

    it("parses links", () => {
      expect(note.linkIds).toEqual(new Set(["123.md", "456.md"]));
    });
  });
});

export default {};
