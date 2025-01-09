import { markdownParser } from "./parser";

describe("Parser", () => {
  it("parses links as nodes", () => {
    const html = `[ABC](https://abc.com)`;

    const doc = markdownParser.parse(html);

    expect(doc.toJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "link",
              attrs: {
                href: "https://abc.com",
                title: null,
              },
              content: [{ type: "text", text: "ABC" }],
            },
          ],
        },
      ],
    });
  });

  it("parses inline math", () => {
    const markdown = "Here is some math: $1 + 2$";

    const doc = markdownParser.parse(markdown);

    expect(doc.toJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Here is some math: " },
            { type: "math_inline" }
          ]
        }
      ]
    });
  });

  it("parses block math", () => {
    const markdown = "$$\n1 + 2\n$$";

    const doc = markdownParser.parse(markdown);

    expect(doc.toJSON()).toEqual({
      type: "doc",
      content: [
        { type: "math_display" }
      ]
    });
  });
});
