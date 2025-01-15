import { State, NoteCard } from "./index.js";
import { getState } from "./fixture.js";

describe("State.openStream", () => {
  it("opens a new stream", () => {
    const state = getState();

    State.openStream(state);

    expect(state.streams.length).toEqual(3);
  });
});
