import markdownit from "markdown-it";
import Token from "markdown-it/lib/token";

interface ParsedNote {
  markdown: string;
  title: string;
  body: string;
  linkIds: Set<string>;
}

const parser = markdownit("commonmark");

const getLinks = (tokens: Token[]): Set<string> => {
  const links = new Set<string>();

  tokens.forEach((token) => {
    if (token.type !== "inline") return;

    token.children?.forEach((child) => {
      if (child.type !== "link_open") return;

      const href = child.attrs?.find(([key]) => key === "href");

      if (!href) return;

      links.add(href[1]);
    });
  });

  return links;
};

export function fromMarkdown(markdown: string): ParsedNote {
  const tokens = parser.parse(markdown, {});

  const inline = tokens.filter((token) => token.type === "inline");
  const title = inline[0]?.content || "";
  const body = inline
    .slice(1)
    .map((inline) => inline.content)
    .join("\n");
  const linkIds = getLinks(tokens);

  return {
    markdown,
    title,
    linkIds,
    body,
  };
}
