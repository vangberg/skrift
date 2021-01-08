import { State, NoteCard } from ".";
import { getState } from "./fixture";

describe("State.updateCard", () => {
  it("updates card", () => {
    let state = getState();

    State.updateCard(state, [0, 1], { id: "x" });

    expect((State.at(state, [0, 1]) as NoteCard).id).toEqual("x");
  });
});
