/*
A reference counting cache, where the same resource can be claimed by multiple
parties. The resource is only removed when there are no more claims to it.
*/

export interface CacheEntry<Value> {
  claims: number;
  value: Value | null;
}

export type SCache<Value> = Record<string, CacheEntry<Value>>;

export const SCache = {
  claim<Value>(cache: SCache<Value>, key: string, defaultValue?: Value) {
    const entry = cache[key];

    if (entry) {
      entry.claims++;
    } else {
      cache[key] = { value: defaultValue || null, claims: 1 };
    }
  },

  release<Value>(cache: SCache<Value>, key: string) {
    const entry = cache[key];

    if (!entry) {
      return;
    }

    if (entry.claims === 1) {
      delete cache[key];
    } else {
      entry.claims--;
    }
  },

  set<Value>(cache: SCache<Value>, key: string, value: Value) {
    const entry = cache[key];

    if (entry) {
      entry.value = value;
    }
  },

  get<Value>(cache: SCache<Value>, key: string): Value | null {
    const entry = cache[key];

    if (!entry) {
      return null;
    }

    return entry.value;
  },
};
