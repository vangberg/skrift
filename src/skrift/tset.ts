// A number of utilities for working with Set's in a strongly typed way.

export const TSet = {
  union<T>(a: Set<T>, b: Set<T>) {
    return new Set([...a, ...b]);
  },

  intersection<T>(a: Set<T>, b: Set<T>) {
    return new Set([...a].filter((x) => b.has(x)));
  },

  difference<T>(a: Set<T>, b: Set<T>) {
    return new Set([...a].filter((x) => !b.has(x)));
  },
};
