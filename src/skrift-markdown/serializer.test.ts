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
});
