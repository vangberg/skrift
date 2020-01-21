import { fromMarkdown } from "./fromMarkdown";

export interface Note {
  title: string;
  links: NoteLink[];
  markdown: string;
}

export interface NoteLink {
  id: string;
}

export const Note = {
  fromMarkdown
};
