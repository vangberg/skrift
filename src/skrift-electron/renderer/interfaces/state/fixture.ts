import { State, Card, NoteCard } from "./index.js";

export const cardA = (): NoteCard => ({
  meta: { key: 1, collapsed: false },
  type: "note",
  id: "a",
});

export const cardB = (): NoteCard => ({
  meta: { key: 2, collapsed: false },
  type: "note",
  id: "b",
});

export const cardC = (): NoteCard => ({
  meta: { key: 3, collapsed: false },
  type: "note",
  id: "c",
});

export const cardD = (): NoteCard => ({
  meta: { key: 4, collapsed: false },
  type: "note",
  id: "d",
});

export const getState = (): State => ({
  streams: [
    {
      // [0]
      key: 1,
      type: "stream",
      cards: [
        cardA(), // [0, 0]
        cardB(), // [0, 1]
      ],
    },
    {
      // [1]
      key: 2,
      type: "stream",
      cards: [
        cardC(), // [1, 0]
      ],
    },
  ],
});
