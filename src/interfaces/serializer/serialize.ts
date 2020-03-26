import { Node, Text } from "slate";

function indent(level: number, str: string): string {
  const prepend = " ".repeat(level);
  return str
    .split("\n")
    .map(s => prepend + s)
    .join("\n");
}

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
    case "bulleted-list":
      return bulletedList(node);
    case "numbered-list":
      return numberedList(node);
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

function bulletedList(node: Node): string {
  return node.children
    .map((item: Node) => {
      const [head, ...tail]: Node[] = item.children;
      if (!head) {
        return [];
      }
      return [
        `* ${serializeNode(head).trim()}\n`,
        ...tail.map(node => indent(2, serializeNode(node)).trimRight() + "\n")
      ].join("");
    })
    .join("");
}

function numberedList(node: Node): string {
  return node.children
    .map(
      (child: Node, index: number) =>
        `${index + 1}. ${serializeChildren(child)}\n`
    )
    .join("");
}
