import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.zoomCard", () => {
  it("creates a workspace and moves card into it", () => {
    let state = getState();

    State.zoomCard(state, [0, 0]);

    const workspace = State.at(state, [0, 0]);

    expect(workspace.type).toEqual("workspace");
    expect((workspace as WorkspaceCard).streams[0].cards).toEqual([cardA()]);
  });
});
