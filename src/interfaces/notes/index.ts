import { Note, NoteID } from "../note";

export type Notes = Map<NoteID, Note>;

export const Notes = {
  getByIds(notes: Notes, ids: NoteID[]): Note[] {
    const result: Note[] = [];
    ids.forEach(id => {
      const note = Notes.getNote(notes, id);
      if (note) {
        result.push(note);
      }
    });
    return result;
  },

  getNote(notes: Notes, id: NoteID): Note | undefined {
    return notes.get(id);
  },

  setNote(notes: Notes, note: Note) {
    notes.set(note.id, note);
  },

  deleteNote(notes: Notes, id: NoteID) {
    notes.delete(id);
  },

  linksToBacklinks(notes: Notes, id: NoteID) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      throw new Error(
        `Could not add note ${id} to backlinks, since it doesn't exist`
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
      return;
    }

    note.backlinks.add(backlink);
  },

  removeBacklink(
    notes: Notes,
    { id, backlink }: { id: NoteID; backlink: NoteID }
  ) {
    const note = Notes.getNote(notes, id);

    if (!note) {
      return;
    }

    note.backlinks.delete(backlink);
  },

  byDate(notes: Notes): Note[] {
    return [...notes.values()]
      .sort((n1, n2) => n1.id.localeCompare(n2.id))
      .reverse();
  }
};
