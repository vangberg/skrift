import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.close", () => {
  describe("with path", () => {
    it("closes card in root workspace", () => {
      let state = getState();

      State.close(state, { path: [0, 0] });

      expect(state.workspace.streams[0].cards).toEqual([cardB()]);
    });

    it("closes stream in root workspace", () => {
      let state = getState();

      State.close(state, { path: [1] });

      expect(state.workspace.streams.map((s) => s.key)).toEqual([1, 3]);
    });

    it("closes card in nested workspace", () => {
      let state = getState();

      State.close(state, { path: [2, 0, 0, 0] });

      expect(
        (State.at(state, [2, 0]) as WorkspaceCard).streams[0].cards
      ).toEqual([]);
    });
  });

  describe("with match", () => {
    it("closes matching entries in root workspace", () => {
      let state = getState();

      State.close(state, { match: { type: "note", id: "a" } });

      expect(state.workspace.streams[0].cards).toEqual([cardB()]);
    });

    it("closes matching entries in nested workspace", () => {
      let state = getState();

      State.close(state, { match: { type: "note", id: "d" } });

      expect(
        (State.at(state, [2, 0]) as WorkspaceCard).streams[0].cards
      ).toEqual([]);
    });
  });
});
