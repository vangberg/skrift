import { Element } from 'slate'
import { NoteLinkElement } from './index'

export function isNoteLink(node: Element): node is NoteLinkElement {
  return node.type === 'note-link'
}