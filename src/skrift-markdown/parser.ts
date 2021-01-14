import markdownit from "markdown-it/lib";
// @ts-ignore
import { MarkdownParser, schema as markdownSchema } from "prosemirror-markdown";
import { defaultMarkdownParser } from "prosemirror-markdown";
import { Node, Schema } from "prosemirror-model";

export const schema = new Schema({
  nodes: markdownSchema.spec.nodes.addBefore("text", "link", {
    inline: true,
    group: "inline",
    content: "inline*",
    atom: true,
    selectable: false,
    draggable: false,
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: "a[href]",
        // @ts-ignore
        getAttrs(dom) {
          return {
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
          };
        },
      },
    ],
    // @ts-ignore
    toDOM(node: Node) {
      return ["a", node.attrs, 0];
    },
  }),
  marks: markdownSchema.spec.marks.remove("link"),
});

const tokens = {
  ...defaultMarkdownParser.tokens,
  link: {
    block: "link",
    // @ts-ignore
    getAttrs: (tok) => ({
      href: tok.attrGet("href"),
      title: tok.attrGet("title") || null,
    }),
  },
};

export const markdownParser = new MarkdownParser(
  schema,
  markdownit("commonmark", { html: false }),
  tokens
);
