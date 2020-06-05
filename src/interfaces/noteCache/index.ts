import { NoteID, Note } from "../note";

export interface NoteCacheEntry {
  id: NoteID;
  title: string;
  modifiedAt: Date;
}

export type NoteCache = Map<NoteID, NoteCacheEntry>;

export const NoteCache = {
  toEntry(note: Note): NoteCacheEntry {
    const { id, title, modifiedAt } = note;

    return { id, title, modifiedAt };
  },

  byDate(cache: NoteCache): NoteCacheEntry[] {
    return [...cache.values()]
      .sort((a, b) => a.id.localeCompare(b.id))
      .reverse();
  },

  byModifiedAt(cache: NoteCache): NoteCacheEntry[] {
    return [...cache.values()]
      .sort((a, b) => a.modifiedAt.getTime() - b.modifiedAt.getTime())
      .reverse();
  },
};
