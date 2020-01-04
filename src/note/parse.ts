import { Node } from 'slate'
import { Serializer } from '../serializer'
import { Note, NoteLink } from './'

function parseTitle(nodes: Node[]): string {
  if (nodes.length === 0) { return "" }

  return Node.string(nodes[0])
}

function parseLinks(nodes: Node[]): NoteLink[] {
  const elements = Node.elements({ type: 'root', children: nodes })

  return Array.from(elements)
    .map(([element, path]) => element)
    .filter(Serializer.isNoteLink)
    .map(link => ({ id: link.id }))
}

export function parse(markdown: string): Note {
  const nodes = Serializer.deserialize(markdown)

  return {
    title: parseTitle(nodes),
    links: parseLinks(nodes),
    backlinks: [],
    markdown
  }
}