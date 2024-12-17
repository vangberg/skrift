import { State } from ".";
import { cardA, cardB, getState } from "./fixture";

describe("State.dropOnNewStream", () => {
    it("prepends a new stream", () => {
        const state = getState();

        State.dropOnNewStream(state, cardA().meta.key, "prepend");

        expect(state.streams.length).toEqual(3);
        expect(state.streams[0].cards).toEqual([cardA()]);
        expect(state.streams[1].cards).toEqual([cardB()]);
    });
    it("appends a new stream", () => {
        const state = getState();

        State.dropOnNewStream(state, cardA().meta.key, "append");

        expect(state.streams.length).toEqual(3);
        expect(state.streams[0].cards).toEqual([cardB()]);
        expect(state.streams[2].cards).toEqual([cardA()]);
    });
});
