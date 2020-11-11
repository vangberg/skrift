import { StreamIndex } from "./streams";

type Id = { type: "stream"; index: StreamIndex };

export const DroppableIds = {
  serialize(id: Id): string {
    return JSON.stringify(id);
  },

  deserialize(str: string): Id {
    return JSON.parse(str);
  },
};
