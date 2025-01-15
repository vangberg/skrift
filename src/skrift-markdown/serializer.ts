import { unified } from "unified";
import remarkStringify from "remark-stringify";
import {
  fromProseMirror,
  fromPmNode,
  fromPmMark,
} from "@handlewithcare/remark-prosemirror";
import type { Node } from "prosemirror-model";

import { schema } from "./schema";

export function proseMirrorToMarkdown(doc: Node) {
  // Convert to mdast with the fromProseMirror util.
  // It takes a schema, a set of node handlers, and a
  // set of mark handlers, each of which converts a
  // ProseMirror node or mark to an mdast node.
  const mdast = fromProseMirror(doc, {
    schema: schema,
    nodeHandlers: {
      // Simple nodes can be converted with the fromPmNode
      // util.
      paragraph: fromPmNode("paragraph"),
      heading: fromPmNode("heading"),
      list_item: fromPmNode("listItem"),
      // You can set mdast node properties from the
      // ProseMirror node or its attrs
      ordered_list: fromPmNode("list", () => ({
        ordered: true,
      })),
      bullet_list: fromPmNode("list", () => ({
        ordered: false,
      })),
    },
    markHandlers: {
      // Simple marks can be converted with the fromPmMark
      // util.
      em: fromPmMark("emphasis"),
      strong: fromPmMark("strong"),
      // Again, mdast node properties can be set from the
      // ProseMirror mark attrs
      link: fromPmMark("link", (mark) => ({
        url: mark.attrs["href"],
        title: mark.attrs["title"],
      })),
    },
  });

  return unified().use(remarkStringify).stringify(mdast);
}
