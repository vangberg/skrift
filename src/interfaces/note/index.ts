import { fromMarkdown } from "./fromMarkdown";

export interface Note {
  title: string;
  links: Set<string>;
  backlinks: Set<string>;
  markdown: string;
}

export const Note = {
  fromMarkdown
};
