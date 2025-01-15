import { State, NoteCard } from "./index.js";
import { getState } from "./fixture.js";

describe("State.updateCard", () => {
  it("updates card", () => {
    const state = getState();

    State.updateCard(state, [0, 1], { id: "x" });

    expect((state.streams[0].cards[1] as NoteCard).id).toEqual("x");
  });
});
