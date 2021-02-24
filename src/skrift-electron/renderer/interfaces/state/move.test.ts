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
});
