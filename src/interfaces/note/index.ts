import { fromMarkdown } from "./fromMarkdown";
import { Node } from "slate";

export type NoteID = string;

export interface Note {
  id: NoteID;
  title: string;
  body: string;
  links: Set<NoteID>;
  backlinks: Set<NoteID>;
  slate: Node[];
  modifiedAt: Date;
}

export const Note = {
  title(slate: Node[]): string {
    if (slate.length === 0) {
      return "";
    }

    return Node.string(slate[0]);
  },

  fromMarkdown,

  empty(partial?: Partial<Note>): Note {
    return {
      id: "",
      title: "",
      body: "",
      links: new Set(),
      backlinks: new Set(),
      slate: [],
      modifiedAt: new Date(),
      ...(partial || {}),
    };
  },
};
