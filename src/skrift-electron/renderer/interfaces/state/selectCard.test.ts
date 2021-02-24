import { NoteCard, State } from ".";
import { getState } from "./fixture";

describe("State.selectCard", () => {
  it("replaces current selection", () => {
    let state = getState();

    State.selectCard(state, [1, 0]);

    const previous = State.at(state, [0, 0]) as NoteCard;
    const next = State.at(state, [1, 0]) as NoteCard;

    expect(previous.meta.selected).toEqual(false);
    expect(next.meta.selected).toEqual(true);
  });

  fit("adds to current selection", () => {
    let state = getState();

    State.selectCard(state, [1, 0], { multi: true });

    const previous = State.at(state, [0, 0]) as NoteCard;
    const next = State.at(state, [1, 0]) as NoteCard;

    expect(previous.meta.selected).toEqual(true);
    expect(next.meta.selected).toEqual(true);
  });
});
