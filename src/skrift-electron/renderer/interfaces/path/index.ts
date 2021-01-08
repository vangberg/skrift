export type Path = number[];

export const Path = {
  isRoot(path: Path): boolean {
    return path.length === 0;
  },

  last(path: Path): number {
    return path[path.length - 1];
  },

  isSibling(p1: Path, p2: Path): boolean {
    const ancestors1 = p1.slice(0, -1);
    const ancestors2 = p2.slice(0, -1);

    return (
      Path.last(p1) !== Path.last(p2) && Path.equals(ancestors1, ancestors2)
    );
  },

  equals(p1: Path, p2: Path): boolean {
    return p1.every((value, index) => value === p2[index]);
  },

  ancestor(path: Path): Path {
    return path.slice(0, -1);
  },
};
