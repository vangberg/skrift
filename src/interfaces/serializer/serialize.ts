import { Node, Text } from "slate";

export function serialize(nodes: Node[]): string {
  let out = "";

  nodes.forEach(node => {
    out += serializeNode(node);
  });

  return out.trim();
}

function serializeNode(node: Node): string {
  if (Text.isText(node)) {
    return node.text;
  }

  switch (node.type) {
    case "heading":
      return heading(node);
    case "paragraph":
      return paragraph(node);
    case "note-link":
      return noteLink(node);
  }

  return "";
}

function serializeChildren(node: Node): string {
  return node.children.map(serializeNode).join("");
}

function heading(node: Node): string {
  const level = node.level || 1;

  return "#".repeat(level) + " " + serializeChildren(node) + "\n";
}

function paragraph(node: Node): string {
  return "\n" + serializeChildren(node) + "\n";
}

function noteLink(node: Node): string {
  return `[[${node.id}]]`;
}
