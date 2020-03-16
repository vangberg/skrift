import { fromMarkdown } from "./fromMarkdown";

export type NoteID = string;

export interface Note {
  id: NoteID;
  title: string;
  links: Set<NoteID>;
  backlinks: Set<NoteID>;
  markdown: string;
  modifiedAt: Date;
}

export const Note = {
  fromMarkdown,

  empty(partial?: Partial<Note>): Note {
    return {
      id: "",
      title: "",
      links: new Set(),
      backlinks: new Set(),
      markdown: "",
      modifiedAt: new Date(),
      ...(partial || {})
    };
  }
};
