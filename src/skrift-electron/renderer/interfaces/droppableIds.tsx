import { StreamPath } from "./path";

export const DroppableIds = {
  serialize(path: StreamPath): string {
    return JSON.stringify({ type: "droppable", path });
  },

  deserialize(str: string): StreamPath {
    return JSON.parse(str).path;
  },
};
