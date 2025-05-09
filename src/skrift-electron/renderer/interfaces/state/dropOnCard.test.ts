import { expect, describe, test, beforeAll, beforeEach, afterEach } from 'vitest'
import { State, Card, Stream } from "./index.js";
import { cardA, cardB, cardC, cardD, getState } from "./fixture.js";

describe("State.dropOnCard", () => {
  test("does nothing if source and target are the same", () => {
    const state = getState()

    State.dropOnCard(state, 2, 2, "before")

    expect(state.streams[0].cards).toEqual([cardA(), cardB()])
  })

  test("moves card before target card", () => {
    const state = getState()

    State.dropOnCard(state, 3, 2, "before")

    expect(state.streams[0].cards).toEqual([cardA(), cardC(), cardB()])
  })

  test("moves card after target card", () => {
    const state = getState()

    State.dropOnCard(state, 3, 2, "after");

    expect(state.streams[0].cards).toEqual([cardA(), cardB(), cardC()]);
  });
});
