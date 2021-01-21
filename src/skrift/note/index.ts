import { fromMarkdown } from "./fromMarkdown";

export type NoteID = string;

export interface Note {
  id: NoteID;
  markdown: string;
  title: string;
  body: string;
  linkIds: Set<NoteID>;
  backlinkIds: Set<NoteID>;
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
      linkIds: new Set(),
      backlinkIds: new Set(),
      modifiedAt: new Date(),
      ...(partial || {}),
    };
  },
};
