import { createHyperscript } from "slate-hyperscript";
import { Editor, Node, Element, Text } from "slate";
import assert from "assert";

export const jsx = createHyperscript({
  elements: {
    paragraph: { type: "paragraph" },
    heading: { type: "heading" },
    "bulleted-list": { type: "bulleted-list" },
    "list-item": { type: "list-item" },
    "note-link": { type: "note-link" }
  }
});

export const assertEqual = (actual: Editor, expected: Editor) => {
  const actual_hp = hyperprint(actual.children).join("\n");
  const expected_hp = hyperprint(expected.children).join("\n");
  assert.deepEqual(actual_hp, expected_hp);
  assert.deepEqual(actual.selection, expected.selection);
};

export const hyperprint = (
  nodes: Node[],
  level: number = 0,
  path: number[] = []
): string[] => {
  const lines: string[] = [];
  const pad = " ".repeat(level);

  nodes.forEach((node, idx) => {
    if (Text.isText(node)) {
      lines.push(pad + node.text);
      return;
    }

    if (Element.isElement(node)) {
      const nodePath = path.concat(idx);
      lines.push(pad + `<${node.type}> [${nodePath.join(", ")}]`);
      lines.push(...hyperprint(node.children, level + 2, nodePath));
      lines.push(pad + `</${node.type}>`);
    }
  });

  return lines;
};
