import { deserialize, deserializeInline } from "./deserialize";

describe("deserialize", () => {
  describe("heading", () => {
    it("deserializes", () => {
      const result = deserialize("# Heading 1");
      const expected = [
        {
          type: "heading",
          level: 1,
          children: [{ text: "Heading 1" }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("empty heading", () => {
    it("deserializes", () => {
      const result = deserialize("# ");
      const expected = [
        {
          type: "heading",
          level: 1,
          children: [{ text: "" }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("note link", () => {
    it("deserializes", () => {
      const result = deserialize("[[123]]");
      const expected = [
        {
          type: "paragraph",
          children: [
            { text: "" },
            {
              type: "note-link",
              id: "123",
              children: [{ text: "[[123]]" }]
            },
            { text: "" }
          ]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("bulleted list", () => {
    it("deserializes", () => {
      const note = `* Item 1
* Item 2
`;
      const result = deserialize(note);
      const expected = [
        {
          type: "bulleted-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "Item 1" }]
            },
            {
              type: "list-item",
              children: [{ text: "Item 2" }]
            }
          ]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("nested bulleted list", () => {
    it("deserializes", () => {
      const note = `* Top 1
  * Nested 1
  
  Nested paragraph
`;
      const result = deserialize(note);
      const expected = [
        {
          type: "bulleted-list",
          children: [
            {
              type: "list-item",
              children: [
                { type: "paragraph", children: [{ text: "Top 1" }] },
                {
                  type: "bulleted-list",
                  children: [
                    {
                      type: "list-item",
                      children: [{ text: "Nested 1" }]
                    }
                  ]
                },
                {
                  type: "paragraph",
                  children: [{ text: "Nested paragraph" }]
                }
              ]
            }
          ]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("numbered list", () => {
    it("deserializes", () => {
      const note = `1. Item 1
2. Item 2
`;
      const result = deserialize(note);
      const expected = [
        {
          type: "numbered-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "Item 1" }]
            },
            {
              type: "list-item",
              children: [{ text: "Item 2" }]
            }
          ]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  const note = `# A title

  Someone ([[123]]) said.`;

  describe("note", () => {
    it("deserializes", () => {
      const result = deserialize(note);
      const expected = [
        {
          type: "heading",
          level: 1,
          children: [{ text: "A title" }]
        },
        {
          type: "paragraph",
          children: [
            { text: "Someone (" },
            { text: "" },
            {
              type: "note-link",
              id: "123",
              children: [{ text: "[[123]]" }]
            },
            { text: "" },
            { text: ") said." }
          ]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("empty note", () => {
    it("deserializes", () => {
      const result = deserialize("");
      const expected = [
        {
          type: "paragraph",
          children: [{ text: "" }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });
});

describe("desiralizeInline", () => {
  describe("note link", () => {
    it("deserializes", () => {
      const result = deserializeInline("[[123]]");
      const expected = [
        { text: "" },
        {
          type: "note-link",
          id: "123",
          children: [{ text: "[[123]]" }]
        },
        { text: "" }
      ];

      expect(result).toEqual(expected);
    });
  });
});

export default {};
