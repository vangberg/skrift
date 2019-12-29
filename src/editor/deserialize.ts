import Remarkable, { Token, BlockContentToken, TextToken, HeadingOpenToken } from 'remarkable'
import { Node } from 'slate'
import { noteLink as noteLinkRule } from '../remarkable-note-link'

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

md.inline.ruler.push("note-link", noteLinkRule, {})

function isTextToken(token: Token): token is TextToken {
  return (token.type === 'text')
}

function isHeadingOpenToken(token: Token): token is HeadingOpenToken {
  return (token.type === 'heading_open')
}

export function parseMarkdown(markdown: string): Token[] {
  return md.parse(markdown, {})
}

export function parse(tokens: Token[]): Node[] {
  const nodes = []

  let token
  while (token = tokens.shift()) {
    switch (token.type) {
      case 'heading_open':
        nodes.push(...heading(token, tokens))
        break
      case 'inline':
        nodes.push(...inline(token, tokens))
        break
      case 'text':
        nodes.push(...text(token))
        break
      case 'paragraph_open':
        nodes.push(...paragraph(tokens))
        break
      case 'note_link_open':
        nodes.push(...noteLink(tokens))
        break
    }
  }

  return nodes
}

function paragraph(tokens: Token[]): Node[] {
  const children: Token[] = []
  let next

  while (next = tokens.shift()) {
    if (next.type === 'paragraph_close') { break }
    children.push(next)
  }

  return [{
    type: 'paragraph',
    children: parse(children)
  }]
}

function heading(token: Token, tokens: Token[]): Node[] {
  if (!isHeadingOpenToken(token)) {
    throw `Expected token of type 'heading_open', got ${token.type}`
  }

  const children: Token[] = []

  let next
  while (next = tokens.shift()) {
    if (next.type === 'heading_close') { break }

    children.push(next)
  }

  return [{
    type: 'heading' + token.hLevel,
    children: [
      { text: '#'.repeat(token.hLevel) + ' ' },
      ...parse(children)
    ]
  }]
}

function inline(token: BlockContentToken, tokens: Token[]): Node[] {
  if (!token.children) { return [] }

  return parse(token.children)
}

function text(token: Token): Node[] {
  if (!isTextToken(token)) { return [] }
  if (!token.content) { return [] }

  return [{ text: token.content }]
}

function noteLink(tokens: Token[]): Node[] {
  const children: Token[] = []
  let next
  while (next = tokens.shift()) {
    if (next.type === 'note_link_close') { break }
    children.push(next)
  }

  if (children.length > 1) {
    throw `Expected 1 children, got ${children.length}`
  }

  const child = children[0]

  if (!isTextToken(child)) {
    throw `Expected token of type 'text', got ${child.type}`
  }

  return [{
    type: 'note-link',
    id: child.content,
    children: [{ text: `[[${child.content}]]` }]
  }]
}

export default function deserialize(markdown: string): Node[] {
  const tokens = parseMarkdown(markdown)
  const nodes = parse(tokens)
  return nodes
} 