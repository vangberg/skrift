import { Path } from "./path";

export const DroppableIds = {
  serialize(path: Path): string {
    return JSON.stringify({ type: "droppable", path });
  },

  deserialize(str: string): Path {
    return JSON.parse(str).path;
  },
};
