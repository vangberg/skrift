interface ParsedNote {
  markdown: string;
  title: string;
  body: string;
  linkIds: Set<string>;
}

export function fromMarkdown(markdown: string): ParsedNote {
  const lines = markdown.split(/\r?\n/);

  return {
    markdown,
    title: lines[0],
    linkIds: new Set(),
    body: lines.slice(1, -1).join("\n"),
  };
}
