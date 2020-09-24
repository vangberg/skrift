import { NoteID, Note } from "../note";

export interface NoteIndexEntry {
  id: NoteID;
  title: string;
  modifiedAt: Date;
}

export type NoteIndex = Map<NoteID, NoteIndexEntry>;

export const NoteIndex = {
  toEntry(note: Note): NoteIndexEntry {
    const { id, title, modifiedAt } = note;

    return { id, title, modifiedAt };
  },

  byIds(cache: NoteIndex, ids: NoteID[]): NoteIndexEntry[] {
    const entries: NoteIndexEntry[] = [];

    ids.forEach((id) => {
      const entry = cache.get(id);
      if (entry) {
        entries.push(entry);
      }
    });

    return entries;
  },

  byDate(cache: NoteIndex): NoteIndexEntry[] {
    return [...cache.values()]
      .sort((a, b) => a.id.localeCompare(b.id))
      .reverse();
  },

  byModifiedAt(cache: NoteIndex): NoteIndexEntry[] {
    return [...cache.values()]
      .sort((a, b) => a.modifiedAt.getTime() - b.modifiedAt.getTime())
      .reverse();
  },
};
