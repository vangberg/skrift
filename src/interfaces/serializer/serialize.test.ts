import { serialize } from "./serialize";

const value = [
  {
    type: "heading",
    level: 1,
    children: [{ text: "A title" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "Someone (" },
      {
        type: "note-link",
        id: "123",
        children: [{ text: "[[123]]" }],
      },
      { text: ") said." },
    ],
  },
];

describe("slate value", () => {
  it("serializes to markdown", () => {
    const result = serialize(value);

    const expected = `# A title

Someone ([[123]]) said.`;

    expect(result).toEqual(expected);
  });
});

describe("bulleted list", () => {
  it("serializes", () => {
    const value = [
      {
        type: "bulleted-list",
        children: [
          {
            type: "list-item",
            children: [{ text: "Item 1" }],
          },
          {
            type: "list-item",
            children: [{ text: "Item 2" }],
          },
        ],
      },
    ];

    const expected = `* Item 1
* Item 2`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

describe("bulleted list with note links", () => {
  it("serializes", () => {
    const value = [
      {
        type: "bulleted-list",
        children: [
          {
            type: "list-item",
            children: [
              { text: "A link: " },
              {
                type: "note-link",
                id: "abc",
                children: [{ text: "" }],
              },
            ],
          },
        ],
      },
    ];

    const expected = `* A link: [[abc]]`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

describe("bulleted list with three paragraphs in item", () => {
  it("serializes", () => {
    const value = [
      {
        type: "bulleted-list",
        children: [
          {
            type: "list-item",
            children: [
              { type: "paragraph", children: [{ text: "Para 1" }] },
              { type: "paragraph", children: [{ text: "Para 2" }] },
              { type: "paragraph", children: [{ text: "Para 3" }] },
            ],
          },
        ],
      },
    ];

    const expected = `* Para 1
  
  Para 2
  
  Para 3`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

describe("bulleted list with nested bulleted list", () => {
  it("serializes", () => {
    const value = [
      {
        type: "bulleted-list",
        children: [
          {
            type: "list-item",
            children: [
              { type: "paragraph", children: [{ text: "Item 1" }] },
              {
                type: "bulleted-list",
                children: [
                  {
                    type: "list-item",
                    children: [{ text: "Item 2" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expected = `* Item 1
  * Item 2`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

describe("numbered list", () => {
  it("serializes", () => {
    const value = [
      {
        type: "numbered-list",
        children: [
          {
            type: "list-item",
            children: [{ text: "Item 1" }],
          },
          {
            type: "list-item",
            children: [{ text: "Item 2" }],
          },
        ],
      },
    ];

    const expected = `1. Item 1
2. Item 2`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

describe("numbered list with nested numbered list", () => {
  it("serializes", () => {
    const value = [
      {
        type: "numbered-list",
        children: [
          {
            type: "list-item",
            children: [
              { type: "paragraph", children: [{ text: "Item 1" }] },
              {
                type: "numbered-list",
                children: [
                  {
                    type: "list-item",
                    children: [{ text: "Item 2" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const expected = `1. Item 1
   1. Item 2`;

    const result = serialize(value);

    expect(result).toEqual(expected);
  });
});

export default {};
