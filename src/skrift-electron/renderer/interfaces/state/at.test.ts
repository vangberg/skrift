import { State } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.at", () => {
  it("gets card in root workspace", () => {
    const state = getState();

    const card = State.at(state, [0, 1]);

    expect(card).toEqual(cardB());
  });

  it("gets card in nested workspace", () => {
    const state = getState();

    const card = State.at(state, [2, 0, 0, 0]);

    expect(card).toEqual(cardD());
  });
});
