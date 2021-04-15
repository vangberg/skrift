import { State, NoteCard } from ".";
import { getState } from "./fixture";

describe("State.openStream", () => {
  it("opens a new stream in root workspace", () => {
    const state = getState();

    State.openStream(state, []);

    expect(State.at(state, [3]).type).toEqual("stream");
  });

  it("opens a new stream in nested workspace", () => {
    const state = getState();

    State.openStream(state, [2, 0]);

    expect(State.at(state, [2, 0, 1]).type).toEqual("stream");
  });
});
