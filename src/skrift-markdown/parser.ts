import { unified } from "unified";
import remarkParse from "remark-parse";
import {
  remarkProseMirror,
  toPmNode,
  toPmMark,
  type RemarkProseMirrorOptions,
} from "@handlewithcare/remark-prosemirror";
import type { Node } from "prosemirror-model";

import { schema } from "./schema";

import { type Nodes as MdastNodes } from "mdast";
import { MdastNodeHandler } from "@handlewithcare/remark-prosemirror/lib/mdast-util-to-prosemirror";

type RequiredMdastHandlers = {
  [Type in Exclude<MdastNodes["type"], "root">]: MdastNodeHandler<Type>;
};

const handlers: RequiredMdastHandlers = {
  paragraph: toPmNode(schema.nodes.paragraph),
  heading: toPmNode(schema.nodes.heading),
  thematicBreak: toPmNode(schema.nodes.horizontal_rule),
  blockquote: toPmNode(schema.nodes.blockquote),
  list: (node, _, state) => {
    const children = state.all(node);
    const nodeType = node.ordered ? schema.nodes.ordered_list : schema.nodes.bullet_list;
    return nodeType.createAndFill({}, children);
  },
  listItem: toPmNode(schema.nodes.list_item),
  table: (node, _, state) => {
    // Tables are not supported in the default prosemirror-markdown schema
    // Convert to paragraph as fallback
    const children = state.all(node);
    return schema.nodes.paragraph.createAndFill({}, children);
  },
  tableRow: (node, _, state) => {
    // Tables are not supported, convert children to inline content
    return state.all(node);
  },
  tableCell: (node, _, state) => {
    // Tables are not supported, convert children to inline content
    return state.all(node);
  },
  html: (node) => {
    // HTML is not supported in prosemirror-markdown schema
    // Convert to text as fallback
    return schema.text(node.value);
  },

  // Inline nodes
  text: (node) => schema.text(node.value),
  emphasis: toPmMark(schema.marks.em),
  strong: toPmMark(schema.marks.strong),
  delete: (node, _, state) => {
    // Strikethrough is not supported in default schema
    // Return as plain text
    return state.all(node);
  },
  inlineCode: (node) => schema.text(node.value),
  break: toPmNode(schema.nodes.hard_break),
  link: toPmMark(schema.marks.link, (node) => ({
    href: node.url,
    title: node.title
  })),
  image: toPmNode(schema.nodes.image, (node) => ({
    src: node.url,
    title: node.title,
    alt: node.alt
  })),

  // Definition nodes (reference-style links)
  definition: () => [], // Definitions are preprocessed and don't need nodes
  footnoteDefinition: () => [], // Footnotes not supported in prosemirror-markdown
  footnoteReference: () => [], // Footnotes not supported
  imageReference: () => [], // Image references are preprocessed
  linkReference: () => [], // Link references are preprocessed

  // Code blocks
  code: (node) => {
    return schema.nodes.code_block.createAndFill({ params: node.lang || '' }, [
      schema.text(node.value)
    ]);
  },

  // YAML frontmatter
  yaml: () => [], // Ignore YAML frontmatter
};

export function markdownToProseMirror(markdown: string): Node {
  const doc = unified()
    // Use remarkParse to parse the markdown string
    .use(remarkParse)
    // Convert to ProseMirror with the remarkProseMirror plugin.
    // It takes the schema and a set of handlers, each of which
    // maps an mdast node type to a ProseMirror node (or nodes)
    .use(remarkProseMirror, {
      schema: schema,
      handlers,
    } satisfies RemarkProseMirrorOptions)
    .processSync(markdown);

  return doc.result as Node;
}
