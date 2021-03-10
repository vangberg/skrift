import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.move", () => {
  it("moves within a stream", () => {
    let state = getState();

    State.move(state, [0, 0], [0, 1]);

    expect(state.workspace.streams[0].cards).toEqual([cardB(), cardA()]);
  });

  it("moves between streams", () => {
    let state = getState();

    State.move(state, [0, 0], [1, 1]);

    expect(state.workspace.streams[0].cards).toEqual([cardB()]);
    expect(state.workspace.streams[1].cards).toEqual([cardC(), cardA()]);
  });

  it("moves between workspaces", () => {
    let state = getState();

    State.move(state, [0, 0], [2, 0, 0, 1]);

    expect(state.workspace.streams[0].cards).toEqual([cardB()]);
    expect(
      (State.at(state, [2, 0]) as WorkspaceCard).streams[0].cards
    ).toEqual([cardD(), cardA()]);
  });

  describe("with negative stream index", () => {
    it("prepends a new stream", () => {
      let state = getState();

      State.move(state, [0, 0], [-1, 0]);

      expect(state.workspace.streams.length).toEqual(4);
      expect(state.workspace.streams[0].cards).toEqual([cardA()]);
      expect(state.workspace.streams[1].cards).toEqual([cardB()]);
    });
  });

  describe("with stream index larger than number of streams", () => {
    it("appends a new stream", () => {
      let state = getState();

      State.move(state, [0, 0], [3, 0]);

      expect(state.workspace.streams.length).toEqual(4);
      expect(state.workspace.streams[0].cards).toEqual([cardB()]);
      expect(state.workspace.streams[3].cards).toEqual([cardA()]);
    });
  });
});
