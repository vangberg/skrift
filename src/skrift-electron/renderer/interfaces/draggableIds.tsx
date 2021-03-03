export const DraggableIds = {
  serialize(key: number): string {
    return JSON.stringify({ type: "draggable", key });
  },

  deserialize(str: string): number {
    return JSON.parse(str).key;
  },
};
