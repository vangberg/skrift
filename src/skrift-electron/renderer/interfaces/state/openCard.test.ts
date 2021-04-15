import { NoteCard, State } from ".";
import { getState } from "./fixture";

describe("State.openCard", () => {
  it("opens card in stream", () => {
    const state = getState();

    State.openCard(state, [0], { mode: "below" }, { type: "note", id: "x" });

    const card = State.at(state, [0, 2]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card at end of stream", () => {
    const state = getState();

    State.openCard(state, [0, 0], { mode: "below" }, { type: "note", id: "x" });

    const card = State.at(state, [0, 2]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in next stream", () => {
    const state = getState();
    State.openCard(state, [0, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = State.at(state, [1, 1]);

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in new stream", () => {
    const state = getState();

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
    const state = getState();

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
