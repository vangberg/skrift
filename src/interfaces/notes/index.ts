import { Note } from "../note";
import produce from "immer";

export type Notes = Map<string, Note>;

export const Notes = {
  getNote(notes: Notes, id: string): Note | undefined {
    return notes.get(id);
  },

  setNote(notes: Notes, id: string, note: Note) {
    notes.set(id, note);
  },

  linksToBacklinks(notes: Notes, id: string) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      throw new Error(
        `Could not add backlinks from note ${id}, since the note does not exist`
      );
    }

    note.links.forEach(link =>
      Notes.addBacklink(notes, { id: link, backlink: id })
    );
  },

  addBacklink(
    notes: Notes,
    { id, backlink }: { id: string; backlink: string }
  ) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      throw new Error(
        `Could not add backlink to note ${id}, since the note does not exist`
      );
    }

    note.backlinks.add(backlink);
  },

  removeBacklink(
    notes: Notes,
    { id, backlink }: { id: string; backlink: string }
  ) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      throw new Error(
        `Could not remove backlink from note ${id}, since the note does not exist`
      );
    }

    note.backlinks.delete(backlink);
  }
};
