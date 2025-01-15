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

export function markdownToProseMirror(markdown: string): Node {
  const doc = unified()
    // Use remarkParse to parse the markdown string
    .use(remarkParse)
    // Convert to ProseMirror with the remarkProseMirror plugin.
    // It takes the schema and a set of handlers, each of which
    // maps an mdast node type to a ProseMirror node (or nodes)
    .use(remarkProseMirror, {
      schema: schema,
      handlers: {
        // For simple nodes, you can use the built-in toPmNode
        // util
        heading: toPmNode(schema.nodes.heading),
        paragraph: toPmNode(schema.nodes.paragraph),
        listItem: toPmNode(schema.nodes.list_item),
        // If you need to take over control, you can write your
        // own handler, which gets passed the mdast node, its
        // parent, and the plugin state, which has helper methods
        // for converting nodes from mdast to ProseMirror.
        list(node, _, state) {
          const children = state.all(node);
          const nodeType = node.ordered
            ? schema.nodes.ordered_list
            : schema.nodes.bullet_list;
          return nodeType.createAndFill({}, children);
        },

        // You can also treat mdast nodes as ProseMirror marks
        emphasis: toPmMark(schema.marks.em),
        strong: toPmMark(schema.marks.strong),
        // And you can set attrs on nodes or marks based on
        // the mdast data
        link: toPmMark(schema.marks.link, (node) => ({
          href: node.url,
          title: node.title,
        })),
      },
    } satisfies RemarkProseMirrorOptions)
    .processSync(markdown);

  return doc.result as Node;
}
