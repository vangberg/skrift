import { State, NoteCard } from ".";
import { getState } from "./fixture";

describe("State.openStream", () => {
  it("opens a new stream", () => {
    const state = getState();

    State.openStream(state);

    expect(state.streams.length).toEqual(3);
  });
});
