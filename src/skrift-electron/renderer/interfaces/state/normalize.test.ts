import { State, Card, Stream } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.normalize", () => {
  it("ensures that at least one stream exists", () => {
    const state: State = {
      streams: [],
    };

    State.normalize(state);

    expect(state.streams.length).toEqual(1);
  });

  it("does not collapse the last stream, even if empty", () => {
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

  it("collapses surplus empty streams", () => {
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

  it("collapses empty streams", () => {
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
});
