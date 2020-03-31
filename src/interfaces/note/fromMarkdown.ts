import { Node } from "slate";
import { Serializer } from "../serializer";

interface ParsedNote {
  title: string;
  body: string;
  links: Set<string>;
  markdown: string;
}

function parseTitle(nodes: Node[]): string {
  if (nodes.length === 0) {
    return "";
  }

  return Node.string(nodes[0]);
}

/** Returns a textual representation of the note, sans the title. */
function parseBody(nodes: Node[]): string {
  const [, ...tail] = nodes;

  if (tail.length === 0) {
    return "";
  }

  return tail.map(node => Node.string(node)).join(" ");
}

function parseLinks(nodes: Node[]): Set<string> {
  const elements = Node.elements({ type: "root", children: nodes });

  return new Set(
    Array.from(elements)
      .map(([element]) => element)
      .filter(Serializer.isNoteLink)
      .map(link => link.id)
  );
}

export function fromMarkdown(markdown: string): ParsedNote {
  const nodes = Serializer.deserialize(markdown);

  return {
    title: parseTitle(nodes),
    links: parseLinks(nodes),
    body: parseBody(nodes),
    markdown
  };
}
