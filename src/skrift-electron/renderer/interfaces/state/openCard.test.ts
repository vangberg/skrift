import { NoteCard, State } from "./index.js";
import { getState } from "./fixture.js";

describe("State.openCard", () => {
  describe("below", () => {
    describe("with stream path", () => {
      it("opens card at top of stream", () => {
        const state = getState();

        State.openCard(
          state,
          [0],
          { mode: "below" },
          { type: "note", id: "x" }
        );

        const card = state.streams[0].cards[0];

        expect(card.type).toEqual("note");
        expect((card as NoteCard).id).toEqual("x");
      });
    });

    describe("with card path", () => {
      it("opens card after card at path", () => {
        const state = getState();

        State.openCard(
          state,
          [0, 0],
          { mode: "below" },
          { type: "note", id: "x" }
        );

        const card = state.streams[0].cards[1];

        expect(card.type).toEqual("note");
        expect((card as NoteCard).id).toEqual("x");
      });
    });
  });

  it("opens card in next stream", () => {
    const state = getState();
    State.openCard(state, [0, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = state.streams[1].cards[0];

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  it("opens card in new stream", () => {
    const state = getState();

    State.openCard(state, [1, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = state.streams[2].cards[0];

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

    const card = state.streams[0].cards[0];

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });
});
