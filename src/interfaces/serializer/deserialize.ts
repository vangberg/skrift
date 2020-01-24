import Remarkable, {
  Token,
  BlockContentToken,
  TextToken,
  HeadingOpenToken
} from "remarkable";
import { Node } from "slate";
import { noteLink as noteLinkRule } from "../../remarkable-note-link";

export const md = new Remarkable();

md.core.ruler.disable([
  "references",
  "footnote_tail",
  "abbr2",
  "replacements",
  "smartquotes",
  "linkify"
]);
md.block.ruler.disable([
  "code",
  "fences",
  "blockquote",
  "hr",
  "list",
  "footnote",
  "htmlblock",
  "table",
  "lheading"
]);
md.inline.ruler.disable([
  "links",
  "escape",
  "backticks",
  "del",
  "emphasis",
  "footnote_ref",
  "autolink",
  "htmltag",
  "entity",
  "newline"
]);

md.inline.ruler.push("note-link", noteLinkRule, {});

function isTextToken(token: Token): token is TextToken {
  return token.type === "text";
}

function isHeadingOpenToken(token: Token): token is HeadingOpenToken {
  return token.type === "heading_open";
}

export function tokenize(markdown: string): Token[] {
  return md.parse(markdown, {});
}

export function tokenizeInline(markdown: string): Token[] {
  return md.parseInline(markdown, {});
}

export function parse(tokens: Token[]): Node[] {
  const nodes = [];

  while (tokens.length > 0) {
    const token = tokens.shift()!;

    switch (token.type) {
      case "heading_open":
        nodes.push(...heading(token, tokens));
        break;
      case "inline":
        nodes.push(...inline(token, tokens));
        break;
      case "text":
        nodes.push(...text(token));
        break;
      case "paragraph_open":
        nodes.push(...paragraph(tokens));
        break;
      case "note_link_open":
        nodes.push(...noteLink(tokens));
        break;
    }
  }

  if (nodes.length === 0) {
    nodes.push({ text: "" });
  }

  return nodes;
}

function takeUntil(tokens: Token[], type: string): Token[] {
  const children = [];

  while (tokens.length > 0) {
    const next = tokens.shift()!;

    if (next.type === type) {
      break;
    }

    children.push(next);
  }

  return children;
}

function inline(token: BlockContentToken, tokens: Token[]): Node[] {
  if (!token.children) {
    throw new Error(`Expected 'inline' token, got '${token.type}'`);
  }

  return parse(token.children);
}

function paragraph(tokens: Token[]): Node[] {
  const children = takeUntil(tokens, "paragraph_close");

  return [
    {
      type: "paragraph",
      children: parse(children)
    }
  ];
}

function heading(token: Token, tokens: Token[]): Node[] {
  if (!isHeadingOpenToken(token)) {
    throw new Error(`Expected 'heading_open' token, got ${token.type}`);
  }

  const children = takeUntil(tokens, "heading_close");

  return [
    {
      type: "heading",
      level: token.hLevel,
      children: parse(children)
    }
  ];
}

function text(token: Token): Node[] {
  if (!isTextToken(token)) {
    throw new Error(`Expected 'text' token, got '${token.type}'`);
  }
  if (!token.content) {
    return [];
  }

  return [{ text: token.content }];
}

function noteLink(tokens: Token[]): Node[] {
  const children = takeUntil(tokens, "note_link_close");

  if (children.length > 1) {
    throw new Error(`Expected 1 children, got ${children.length}`);
  }

  const child = children[0];

  if (!isTextToken(child)) {
    throw new Error(`Expected 'text' token, got ${child.type}`);
  }

  return [
    { text: "" },
    {
      type: "note-link",
      id: child.content,
      children: [{ text: "" }]
    },
    { text: "" }
  ];
}

export function deserialize(markdown: string): Node[] {
  const tokens = tokenize(markdown);

  if (tokens.length === 0) {
    return paragraph([]);
  }

  return parse(tokens);
}

export function deserializeInline(markdown: string): Node[] {
  const tokens = tokenizeInline(markdown);
  const nodes = parse(tokens);
  return nodes;
}
