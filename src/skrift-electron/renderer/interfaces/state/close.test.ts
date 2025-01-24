import { describe, expect, test } from 'vitest'
import { State, Card, Stream } from "./index.js";
import { cardA, cardB, cardC, cardD, getState } from "./fixture.js";

describe("State.close", () => {
  describe("with path", () => {
    test("closes card", () => {
      const state = getState();

      State.close(state, { path: [0, 0] });

      expect(state.streams[0].cards).toEqual([cardB()]);
    });

    test("closes stream", () => {
      const state = getState();

      State.close(state, { path: [1] });

      expect(state.streams.map((s) => s.key)).toEqual([1]);
    });
  });

  describe("with match", () => {
    test("closes matching entries", () => {
      const state = getState();

      State.close(state, { match: { type: "note", id: "a" } });

      expect(state.streams[0].cards).toEqual([cardB()]);
    });
  });
});
