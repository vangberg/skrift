import { Note, NoteID } from "../note";

export type Notes = Map<NoteID, Note>;

export const Notes = {
  getByIds(notes: Notes, ids: NoteID[]): Note[] {
    const result: Note[] = [];
    ids.forEach(id => result.push(Notes.getNote(notes, id)));
    return result;
  },

  getNote(notes: Notes, id: NoteID): Note {
    const note = notes.get(id);

    if (!note) {
      throw new Error(`Could not find note with id ${id}`);
    }

    return note;
  },

  setNote(notes: Notes, note: Note) {
    notes.set(note.id, note);
  },

  linksToBacklinks(notes: Notes, id: NoteID) {
    const note = Notes.getNote(notes, id);

    note.links.forEach(link =>
      Notes.addBacklink(notes, { id: link, backlink: id })
    );
  },

  addBacklink(
    notes: Notes,
    { id, backlink }: { id: NoteID; backlink: NoteID }
  ) {
    const note = Notes.getNote(notes, id);

    note.backlinks.add(backlink);
  },

  removeBacklink(
    notes: Notes,
    { id, backlink }: { id: NoteID; backlink: NoteID }
  ) {
    const note = Notes.getNote(notes, id);

    note.backlinks.delete(backlink);
  },

  byDate(notes: Notes): Note[] {
    return [...notes.values()]
      .sort((n1, n2) => n1.id.localeCompare(n2.id))
      .reverse();
  }
};
