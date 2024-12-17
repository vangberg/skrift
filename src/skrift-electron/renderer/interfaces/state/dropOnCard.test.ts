import { State, Card, Stream } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.dropOnCard", () => {
  it("does nothing if source and target are the same", () => {
    const state = getState()

    State.dropOnCard(state, 2, 2, "above")

    expect(state.streams[0].cards).toEqual([cardA(), cardB()])
  })

  it("moves card above target card", () => {
    const state = getState()

    State.dropOnCard(state, 3, 2, "above")

    expect(state.streams[0].cards).toEqual([cardA(), cardC(), cardB()])
  })

  it("moves card below target card", () => {
    const state = getState()

    State.dropOnCard(state, 3, 2, "below");

    expect(state.streams[0].cards).toEqual([cardA(), cardB(), cardC()]);
  });
});
