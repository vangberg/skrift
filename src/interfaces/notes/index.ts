import { Note, NoteID } from "../note";

export type Notes = Map<NoteID, Note>;

export const Notes = {
  getNote(notes: Notes, id: NoteID): Note | undefined {
    return notes.get(id);
  },

  setNote(notes: Notes, note: Note) {
    notes.set(note.id, note);
  },

  linksToBacklinks(notes: Notes, id: NoteID) {
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
    { id, backlink }: { id: NoteID; backlink: NoteID }
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
    { id, backlink }: { id: NoteID; backlink: NoteID }
  ) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      throw new Error(
        `Could not remove backlink from note ${id}, since the note does not exist`
      );
    }

    note.backlinks.delete(backlink);
  },

  byDate(notes: Notes): Note[] {
    return [...notes.values()]
      .sort((n1, n2) => n1.id.localeCompare(n2.id))
      .reverse();
  }
};
