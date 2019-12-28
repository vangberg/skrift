import Remarkable, { Token } from 'remarkable'
import { Node } from 'slate'
import { noteLink } from './remarkable-note-link'

export const md = new Remarkable()

md.core.ruler.disable([
  'references', 'footnote_tail', 'abbr2',
  'replacements', 'smartquotes', 'linkify'
])
md.block.ruler.disable([
  'code', 'fences', 'blockquote', 'hr',
  'list', 'footnote', 'htmlblock', 'table',
  'lheading'
])
md.inline.ruler.disable([
  'links', 'escape', 'backticks', 'del', 'emphasis',
  'footnote_ref', 'autolink', 'htmltag', 'entity', 'newline'
])

md.inline.ruler.push("note-link", noteLink, {})

export function parseMarkdown(markdown: string): Token[] {
  return []
}

export function remarkableToSlate(remarkable: Token[]): Node[] {
  return []
}

export default function deserialize(markdown: string): Node[] {
  const parsedMarkdown = parseMarkdown(markdown)
  const nodes = remarkableToSlate(parsedMarkdown)
  return nodes
}