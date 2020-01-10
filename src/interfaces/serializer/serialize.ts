import { Node, Text } from 'slate'

export function serialize(nodes: Node[]): string {
  let out = ""
  
  nodes.forEach(node => {
    out += serializeNode(node)
  })

  return out.trim()
}

function serializeNode(node: Node): string {
  if (Text.isText(node)) {
    return node.text
  }

  switch (node.type) {
    case 'heading1':
      return heading1(node)
    case 'paragraph':
      return paragraph(node)
    case 'note-link':
      return noteLink(node)
  }

  return ""
}

function serializeChildren(node: Node): string {
  return node.children.map(serializeNode).join('')
}

function heading1(node: Node): string {
  return '# ' + serializeChildren(node) + '\n'
}

function paragraph(node: Node): string {
  return '\n' + serializeChildren(node) + '\n'
}

function noteLink(node: Node): string {
  return serializeChildren(node)
}