import { unified } from "unified";
import remarkStringify from "remark-stringify";
import {
  fromProseMirror,
  fromPmNode,
  fromPmMark,
} from "@handlewithcare/remark-prosemirror";
import type { Node as PmNode } from "prosemirror-model";

import { schema } from "./schema.js";

export function proseMirrorToMarkdown(doc: PmNode) {
  const mdast = fromProseMirror(doc, {
    schema: schema,
    nodeHandlers: {
      paragraph: fromPmNode("paragraph"),
      heading: fromPmNode("heading", (node) => ({
        depth: node.attrs.level,
      })),
      list_item: fromPmNode("listItem"),
      ordered_list: fromPmNode("list", () => ({
        ordered: true,
      })),
      bullet_list: fromPmNode("list", () => ({
        ordered: false,
      })),
      hard_break: fromPmNode("break"),
      horizontal_rule: fromPmNode("thematicBreak"),
      code_block: fromPmNode("code", (node) => ({
        value: node.textContent,
      })),
      image: fromPmNode("image", (node) => ({
        url: node.attrs.src,
        title: node.attrs.title,
        alt: node.attrs.alt
      })),
      blockquote: fromPmNode("blockquote"),
    },
    markHandlers: {
      em: fromPmMark("emphasis"),
      strong: fromPmMark("strong"),
      link: fromPmMark("link", (mark) => ({
        url: mark.attrs["href"],
        title: mark.attrs["title"],
      })),
      // code: fromPmMark("inlineCode")
    }
  });

  return unified().use(remarkStringify).stringify(mdast);
}
