import { describe, test, expect } from 'vitest';
import { NoteCard, State } from "./index.js";
import { getState } from "./fixture.js";

describe("State.openCard", () => {
  describe("below", () => {
    describe("with stream path", () => {
      test("opens card at top of stream", () => {
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
      test("opens card after card at path", () => {
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

  test("opens card in next stream", () => {
    const state = getState();
    State.openCard(state, [0, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = state.streams[1].cards[0];

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  test("opens card in new stream", () => {
    const state = getState();

    State.openCard(state, [1, 0], { mode: "push" }, { type: "note", id: "x" });

    const card = state.streams[2].cards[0];

    expect(card.type).toEqual("note");
    expect((card as NoteCard).id).toEqual("x");
  });

  test("replaces card at path", () => {
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
