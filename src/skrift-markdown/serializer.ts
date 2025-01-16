import { unified } from "unified";
import remarkStringify from "remark-stringify";
import {
  fromProseMirror,
  fromPmNode,
  fromPmMark,
} from "@handlewithcare/remark-prosemirror";
import type { Node as PmNode } from "prosemirror-model";

import { schema } from "./schema.js";
import { PmNodeHandler } from "@handlewithcare/remark-prosemirror/lib/mdast-util-from-prosemirror.js";
import { PmMarkHandler } from "@handlewithcare/remark-prosemirror/lib/mdast-util-from-prosemirror.js";

type RequiredNodeHandlers = {
  [K in keyof typeof schema.nodes]: PmNodeHandler;
};

type RequiredMarkHandlers = {
  [K in keyof typeof schema.marks]: PmMarkHandler;
};

export function proseMirrorToMarkdown(doc: PmNode) {
  const mdast = fromProseMirror(doc, {
    schema: schema,
    nodeHandlers: {
      paragraph: fromPmNode("paragraph"),
      heading: fromPmNode("heading"),
      list_item: fromPmNode("listItem"),
      ordered_list: fromPmNode("list", () => ({
        ordered: true,
      })),
      bullet_list: fromPmNode("list", () => ({
        ordered: false,
      })),
      text: fromPmNode("text"),
      hard_break: fromPmNode("break"),
      horizontal_rule: fromPmNode("thematicBreak"),
      code_block: fromPmNode("code"),
      image: fromPmNode("image", (node) => ({
        url: node.attrs.src,
        title: node.attrs.title,
        alt: node.attrs.alt
      })),
      doc: fromPmNode("root"),
      blockquote: fromPmNode("blockquote"),
    } satisfies RequiredNodeHandlers,
    markHandlers: {
      em: fromPmMark("emphasis"),
      strong: fromPmMark("strong"),
      link: fromPmMark("link", (mark) => ({
        url: mark.attrs["href"],
        title: mark.attrs["title"],
      })),
      code: fromPmMark("inlineCode"),
    } satisfies RequiredMarkHandlers,
  });

  return unified().use(remarkStringify).stringify(mdast);
}
