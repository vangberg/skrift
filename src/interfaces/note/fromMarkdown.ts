import { Node } from "slate";
import { Serializer } from "../serializer";
import { Note } from ".";

function parseTitle(nodes: Node[]): string {
  if (nodes.length === 0) {
    return "";
  }

  return Node.string(nodes[0]);
}

function parseLinks(nodes: Node[]): Set<string> {
  const elements = Node.elements({ type: "root", children: nodes });

  return new Set(
    Array.from(elements)
      .map(([element, path]) => element)
      .filter(Serializer.isNoteLink)
      .map(link => link.id)
  );
}

export function fromMarkdown(markdown: string): Note {
  const nodes = Serializer.deserialize(markdown);

  return {
    title: parseTitle(nodes),
    links: parseLinks(nodes),
    backlinks: new Set(),
    markdown
  };
}
