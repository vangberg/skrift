import markdownit from "markdown-it";
import { MarkdownParser, schema as markdownSchema } from "prosemirror-markdown";
import { defaultMarkdownParser } from "prosemirror-markdown";
import { Node, Schema } from "prosemirror-model";
import markdownItMath from "markdown-it-math";

export const schema = new Schema({
  // @ts-ignore
  nodes: markdownSchema.spec.nodes.
    addBefore("text", "link", {
      inline: true,
      group: "inline",
      content: "inline*",
      atom: true,
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
    }).
    addBefore("text", "math_inline", {
      group: "inline math",
      content: "text*",
      inline: true,
      atom: true,
      toDOM: () => ["math-inline", { class: "math-node" }, 0],
      parseDOM: [{
        tag: "math-inline"
      }],
    }).
    addBefore("text", "math_display", {
      group: "block math",
      content: "text*",
      atom: true,
      code: true,
      toDOM: () => ["math-display", { class: "math-node" }, 0],
      parseDOM: [{
        tag: "math-display"
      }]
    }),
  // @ts-ignore
  marks: markdownSchema.spec.marks.remove("link"),
});

const md = markdownit("commonmark", { html: false })
  .use(markdownItMath, {
    inlineOpen: '$',
    inlineClose: '$',
    blockOpen: '$$',
    blockClose: '$$'
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
  math_inline: {
    node: "math_inline",
  },
  math_block: {
    node: "math_display",
  },
};

export const markdownParser = new MarkdownParser(
  schema,
  // @ts-ignore
  md,
  tokens
);
