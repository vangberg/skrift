import { State } from "../state";

export type StreamPath = [number];
export type CardPath = [number, number];
export type Path = StreamPath | CardPath;

export const Path = {
  isCardPath(path: Path): path is CardPath {
    return path.length === 2;
  },

  stream(path: Path): number {
    return path[0];
  },

  streamPath(path: Path): StreamPath {
    return [Path.stream(path)];
  },

  card(path: CardPath): number {
    return path[1];
  },

  findByCardKey(state: State, cardKey: number): Path | undefined {
    for (let stream = 0; stream < state.streams.length; stream++) {
      const cardIndex = state.streams[stream].cards.findIndex((card) => card.meta.key === cardKey);
      if (cardIndex !== -1) {
        return [stream, cardIndex];
      }
    }
  },

  next(path: Path): Path {
    const [stream, card] = path;

    if (typeof card === "number") {
      return [stream, card + 1];
    }

    return [stream + 1];
  },

  last(path: Path): number {
    return path[path.length - 1];
  },

  equals(p1: Path, p2: Path): boolean {
    return p1.every((value, index) => value === p2[index]);
  },
};
