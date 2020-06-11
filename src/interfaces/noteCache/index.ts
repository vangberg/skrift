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

  byIds(cache: NoteCache, ids: NoteID[]): NoteCacheEntry[] {
    const entries: NoteCacheEntry[] = [];

    ids.forEach((id) => {
      const entry = cache.get(id);
      if (entry) {
        entries.push(entry);
      }
    });

    return entries;
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
