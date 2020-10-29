import { Note, NoteID } from "./note";

export interface CacheEntry<Value> {
  claims: number;
  value: Value | null;
}

export type Cache<Key, Value> = Map<Key, CacheEntry<Value>>;

export const Cache = {
  claim<Key, Value>(cache: Cache<Key, Value>, key: Key) {
    let entry = cache.get(key);

    if (entry) {
      entry.claims++;
    } else {
      cache.set(key, { value: null, claims: 1 });
    }
  },

  release<Key, Value>(cache: Cache<Key, Value>, key: Key) {
    let entry = cache.get(key);

    if (!entry) {
      return;
    }

    if (entry.claims === 1) {
      cache.delete(key);
    } else {
      entry.claims--;
    }
  },

  set<Key, Value>(cache: Cache<Key, Value>, key: Key, value: Value) {
    let entry = cache.get(key);

    if (entry) {
      entry.value = value;
    }
  },

  get<Key, Value>(cache: Cache<Key, Value>, key: Key): Value | null {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    return entry.value;
  },
};
