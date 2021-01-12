import { fromMarkdown } from "./fromMarkdown";

export type NoteID = string;

export interface Note {
  id: NoteID;
  markdown: string;
  title: string;
  body: string;
  links: Set<NoteID>;
  backlinks: Set<NoteID>;
  modifiedAt: Date;
}

export const Note = {
  idFromDate(date: Date): string {
    return date.toJSON().replace(/[:-]/g, "");
  },

  fromMarkdown,

  empty(partial?: Partial<Note>): Note {
    return {
      id: "",
      markdown: "",
      title: "",
      body: "",
      links: new Set(),
      backlinks: new Set(),
      modifiedAt: new Date(),
      ...(partial || {}),
    };
  },
};
