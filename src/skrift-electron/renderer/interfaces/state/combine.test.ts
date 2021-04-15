import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.combine", () => {
  it("moves card into first stream in workspace", () => {
    const state = getState();

    State.combine(state, [0, 0], [2, 0]);

    expect((State.at(state, [0]) as Stream).cards).toEqual([cardB()]);
    expect((State.at(state, [2, 0, 0]) as Stream).cards).toEqual([
      cardD(),
      cardA(),
    ]);
  });

  it("combines two note cards into a workspace", () => {
    const state = getState();

    State.combine(state, [0, 0], [0, 1]);

    const stream = State.at(state, [0]) as Stream;
    expect(stream.cards.length).toEqual(1);

    const workspace = stream.cards[0] as WorkspaceCard;
    expect(workspace.type).toEqual("workspace");
    expect(workspace.streams[0].cards).toEqual([cardA(), cardB()]);
  });
});
