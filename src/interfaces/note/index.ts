import { fromMarkdown } from "./fromMarkdown";

export type NoteID = string;
export type NoteRevision = number;

export interface Note {
  id: NoteID;
  revision: NoteRevision;
  title: string;
  links: Set<NoteID>;
  backlinks: Set<NoteID>;
  markdown: string;
}

export const Note = {
  fromMarkdown,

  empty(partial?: Partial<Note>): Note {
    return {
      id: "",
      revision: 0,
      title: "",
      links: new Set(),
      backlinks: new Set(),
      markdown: "",
      ...(partial || {})
    };
  }
};
