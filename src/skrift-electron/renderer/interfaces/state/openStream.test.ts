import { describe, test, expect } from 'vitest';
import { State, NoteCard } from "./index.js";
import { getState } from "./fixture.js";

describe("State.openStream", () => {
  test("opens a new stream", () => {
    const state = getState();

    State.openStream(state);

    expect(state.streams.length).toEqual(3);
  });
});
