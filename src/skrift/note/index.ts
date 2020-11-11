import { fromMarkdown } from "./fromMarkdown";
import { Node } from "slate";
import { Serializer } from "../serializer";

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
  idFromDate(date: Date): string {
    return date.toJSON().replace(/[:-]/g, "");
  },

  title(slate: Node[]): string {
    if (slate.length === 0) {
      return "";
    }

    return Node.string(slate[0]);
  },

  links(slate: Node[]): Set<string> {
    const elements = Node.elements({ type: "root", children: slate });

    return new Set(
      Array.from(elements)
        .map(([element]) => element)
        .filter(Serializer.isNoteLink)
        .map((link) => link.id)
    );
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
