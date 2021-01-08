import { Path } from "./path";

type Id = { type: "stream"; path: Path };

export const DroppableIds = {
  serialize(id: Id): string {
    return JSON.stringify(id);
  },

  deserialize(str: string): Id {
    return JSON.parse(str);
  },
};
