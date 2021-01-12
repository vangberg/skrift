import { NoteCard, State } from ".";
import { getState } from "./fixture";

describe("State.openCard", () => {
  it("opens card below path", () => {
    let state = getState();

    State.openCard(state, [0, 0], { mode: "below" }, { type: "note", id: "x" });

    const card = State.at(state, [0, 1]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in next stream", () => {
    let state = getState();

    State.openCard(state, [0, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = State.at(state, [1, 1]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in new stream", () => {
    let state = getState();

    State.openCard(
      state,
      [2, 0, 0, 0],
      { mode: "push" },
      { type: "note", id: "x" }
    );

    const card = State.at(state, [2, 0, 1, 0]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("replaces card at path", () => {
    let state = getState();

    State.openCard(
      state,
      [0, 0],
      { mode: "replace" },
      { type: "note", id: "x" }
    );

    const card = State.at(state, [0, 0]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });
});
