import { describe, expect, test } from 'vitest';
import { State, Card, Stream } from "./index.js";
import { cardA, cardB, cardC, cardD, getState } from "./fixture.js";

describe("State.normalize", () => {
  test("ensures that at least one stream exists", () => {
    const state: State = {
      streams: [],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(1);
  });

  test("does not collapse the last stream, even if empty", () => {
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

    expect(state.streams.length).toEqual(1);
  });

  test("collapses surplus empty streams", () => {
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

    expect(state.streams.length).toEqual(1);
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

  test("collapses prepending empty streams", () => {
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
          cards: [cardA()],
        },
      ],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(1);
  });
});
