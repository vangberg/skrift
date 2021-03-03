import { Path } from "./path";

export const DraggableIds = {
  serialize(path: Path): string {
    return JSON.stringify(path);
  },

  deserialize(str: string): Path {
    return JSON.parse(str);
  },
};
