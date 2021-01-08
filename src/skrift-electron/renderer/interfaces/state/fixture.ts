import { State, Card } from ".";

export const cardA: Card = { key: 1, type: "note", id: "a" };
export const cardB: Card = { key: 2, type: "note", id: "b" };
export const cardC: Card = { key: 3, type: "note", id: "c" };
export const cardD: Card = { key: 4, type: "note", id: "d" };

export const getState = (): State => ({
  workspace: {
    key: 0,
    type: "workspace",
    streams: [
      {
        // [0]
        key: 1,
        type: "stream",
        cards: [
          cardA, // [0, 0]
          cardB, // [0, 1]
        ],
      },
      {
        // [1]
        key: 2,
        type: "stream",
        cards: [
          cardC, // [1,0]
        ],
      },
      {
        // [2]
        key: 3,
        type: "stream",
        cards: [
          {
            // [2, 0]
            key: 4,
            type: "workspace",
            streams: [
              {
                // [2, 0, 0]
                key: 5,
                type: "stream",
                cards: [
                  cardD, // [2, 0, 0, 0]
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
