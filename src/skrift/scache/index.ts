/*
A reference counting cache, where the same resource can be claimed by multiple
parties. The resource is only removed when there are no more claims to it.
*/

export interface CacheEntry<Value> {
  claims: number;
  value: Value | null;
}

export type SCache<Key, Value> = Map<Key, CacheEntry<Value>>;

export const SCache = {
  claim<Key, Value>(cache: SCache<Key, Value>, key: Key, defaultValue?: Value) {
    const entry = cache.get(key);

    if (entry) {
      entry.claims++;
    } else {
      cache.set(key, { value: defaultValue || null, claims: 1 });
    }
  },

  release<Key, Value>(cache: SCache<Key, Value>, key: Key) {
    const entry = cache.get(key);

    if (!entry) {
      return;
    }

    if (entry.claims === 1) {
      cache.delete(key);
    } else {
      entry.claims--;
    }
  },

  set<Key, Value>(cache: SCache<Key, Value>, key: Key, value: Value) {
    const entry = cache.get(key);

    if (entry) {
      entry.value = value;
    }
  },

  get<Key, Value>(cache: SCache<Key, Value>, key: Key): Value | null {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    return entry.value;
  },
};
