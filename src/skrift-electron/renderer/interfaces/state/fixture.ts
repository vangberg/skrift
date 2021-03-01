import { State, Card, NoteCard } from ".";

export const cardA = (): NoteCard => ({
  meta: { key: 1, selected: true },
  type: "note",
  id: "a",
});

export const cardB = (): NoteCard => ({
  meta: { key: 2, selected: false },
  type: "note",
  id: "b",
});

export const cardC = (): NoteCard => ({
  meta: { key: 3, selected: false },
  type: "note",
  id: "c",
});

export const cardD = (): NoteCard => ({
  meta: { key: 4, selected: false },
  type: "note",
  id: "d",
});

export const getState = (): State => ({
  workspace: {
    meta: { key: 0, selected: false },
    type: "workspace",
    zoom: true,
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
      {
        // [2]
        key: 3,
        type: "stream",
        cards: [
          {
            // [2, 0]
            meta: { key: 4, selected: false },
            type: "workspace",
            zoom: false,
            streams: [
              {
                // [2, 0, 0]
                key: 5,
                type: "stream",
                cards: [
                  cardD(), // [2, 0, 0, 0]
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
