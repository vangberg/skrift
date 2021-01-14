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
              href: "https://abc.com",
            },
          ],
        },
      ],
    });
  });
});
