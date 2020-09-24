import { Note, NoteID } from "./note";

export interface NoteCacheEntry {
  claims: number;
  note: Note | null;
}

export type NoteCache = Map<NoteID, NoteCacheEntry>;

export const NoteCache = {
  claim(cache: NoteCache, id: NoteID) {
    let entry = cache.get(id);

    if (entry) {
      entry.claims++;
    } else {
      cache.set(id, { note: null, claims: 1 });
    }
  },

  release(cache: NoteCache, id: NoteID) {
    let entry = cache.get(id);

    if (!entry) {
      return;
    }

    if (entry.claims === 1) {
      cache.delete(id);
    } else {
      entry.claims--;
    }
  },

  set(cache: NoteCache, note: Note) {
    let entry = cache.get(note.id);

    if (entry) {
      entry.note = note;
    }
  },

  get(cache: NoteCache, id: NoteID): Note | null {
    const entry = cache.get(id);

    if (!entry) {
      return null;
    }

    return entry.note;
  },
};
