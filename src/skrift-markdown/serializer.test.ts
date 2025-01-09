import { Node } from "prosemirror-model";
import { schema } from "./parser";
import { markdownSerializer } from "./serializer";

describe("Serializer", () => {
  it("serializes paragraph with link", () => {
    const doc = Node.fromJSON(schema, {
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

    const markdown = markdownSerializer.serialize(doc);

    expect(markdown).toEqual(`[ABC](https://abc.com)`);
  });

  it("serializes inline math", () => {
    const doc = Node.fromJSON(schema, {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Here is math: " },
            {
              type: "math_inline",
              content: [{ type: "text", text: "1 + 2" }]
            }
          ]
        }
      ]
    });

    const markdown = markdownSerializer.serialize(doc);

    expect(markdown).toEqual("Here is math: $1 + 2$");
  });

  it("serializes block math", () => {
    const doc = Node.fromJSON(schema, {
      type: "doc",
      content: [
        {
          type: "math_display",
          content: [{ type: "text", text: "1 + 2" }]
        }
      ]
    });

    const markdown = markdownSerializer.serialize(doc);

    expect(markdown).toEqual("$$\n1 + 2\n$$");
  });
});
