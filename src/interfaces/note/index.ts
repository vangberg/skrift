import { fromMarkdown } from "./fromMarkdown";

export type NoteID = string;

export interface Note {
  title: string;
  links: Set<NoteID>;
  backlinks: Set<NoteID>;
  markdown: string;
}

export const Note = {
  fromMarkdown,

  empty(): Note {
    return {
      title: "",
      links: new Set(),
      backlinks: new Set(),
      markdown: ""
    };
  }
};
