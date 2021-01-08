import { NoteCard, State } from ".";
import { getState } from "./fixture";

describe("State.openCard", () => {
  it("opens card in existing stream", () => {
    let state = getState();

    State.openCard(state, [2], { type: "note", id: "x" });

    const card = State.at(state, [2, 1]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in new stream", () => {
    let state = getState();

    State.openCard(state, [3], { type: "note", id: "x" });

    const card = State.at(state, [3, 0]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });
});
