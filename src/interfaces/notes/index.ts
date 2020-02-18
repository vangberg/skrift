import { Note } from "../note";
import produce from "immer";

export type Notes = Map<string, Note>;

export const Notes = {
  getNote(notes: Notes, id: string): Note | undefined {
    return notes.get(id);
  },

  setNote(notes: Notes, id: string, note: Note): Notes {
    return produce(notes, draft => draft.set(id, note));
  },

  addBacklink(
    notes: Notes,
    { id, backlink }: { id: string; backlink: string }
  ): Notes {
    return produce(notes, draft => {
      const note = Notes.getNote(draft, id);

      if (!note) {
        throw new Error(
          `Could not add backlink to note ${id}, since the note does not exist`
        );
      }

      note.backlinks.add(backlink);
    });
  }
};
