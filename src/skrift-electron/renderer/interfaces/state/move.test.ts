import { State, Card, Stream } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.move", () => {
  it("moves within a stream", () => {
    const state = getState();

    State.move(state, [0, 0], [0, 1]);

    expect(state.streams[0].cards).toEqual([cardB(), cardA()]);
  });

  it("moves between streams", () => {
    const state = getState();

    State.move(state, [0, 0], [1, 1]);

    expect(state.streams[0].cards).toEqual([cardB()]);
    expect(state.streams[1].cards).toEqual([cardC(), cardA()]);
  });

  describe("with negative stream index", () => {
    it("prepends a new stream", () => {
      const state = getState();

      State.move(state, [0, 0], [-1, 0]);

      expect(state.streams.length).toEqual(3);
      expect(state.streams[0].cards).toEqual([cardA()]);
      expect(state.streams[1].cards).toEqual([cardB()]);
    });
  });

  describe("with stream index larger than number of streams", () => {
    it("appends a new stream", () => {
      const state = getState();

      State.move(state, [0, 0], [2, 0]);

      expect(state.streams.length).toEqual(3);
      expect(state.streams[0].cards).toEqual([cardB()]);
      expect(state.streams[2].cards).toEqual([cardA()]);
    });
  });
});
