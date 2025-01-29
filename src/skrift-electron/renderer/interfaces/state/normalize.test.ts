import { describe, expect, test } from 'vitest';
import { State, Card, Stream } from "./index.js";
import { cardA, cardB, cardC, cardD, getState } from "./fixture.js";

describe("State.normalize", () => {
  test("collapses all empty streams", () => {
    const state: State = {
      streams: [
        {
          key: 1,
          type: "stream",
          cards: [],
        },
        {
          key: 2,
          type: "stream",
          cards: [],
        },
      ],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(0);
  });

  test("collapses empty streams", () => {
    const state: State = {
      streams: [
        {
          key: 1,
          type: "stream",
          cards: [cardA()],
        },
        {
          key: 2,
          type: "stream",
          cards: [],
        },
      ],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(1);
  });

  test("allows all streams to be closed", () => {
    const state: State = {
      streams: [
        {
          key: 1,
          type: "stream",
          cards: [],
        },
      ],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(0);
  });
});
