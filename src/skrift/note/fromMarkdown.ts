interface ParsedNote {
  markdown: string;
  title: string;
  body: string;
  links: Set<string>;
}

export function fromMarkdown(markdown: string): ParsedNote {
  const lines = markdown.split(/\r?\n/);

  return {
    markdown,
    title: lines[0],
    links: new Set(),
    body: lines.slice(1, -1).join("\n"),
  };
}
