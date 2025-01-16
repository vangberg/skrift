import { State } from "./index.js";
import { cardA, cardB, cardC, getState } from "./fixture.js";

describe("State.dropOnStream", () => {
    it("creates a new stream before target stream", () => {
        const state = getState();
        const targetStreamKey = state.streams[1].key;

        State.dropOnStream(state, cardA().meta.key, targetStreamKey, "before");

        expect(state.streams.length).toEqual(3);
        expect(state.streams[0].cards).toEqual([cardB()]);
        expect(state.streams[1].cards).toEqual([cardA()]);
        expect(state.streams[2].cards).toEqual([cardC()]);
    });

    it("creates a new stream after target stream", () => {
        const state = getState();
        const targetStreamKey = state.streams[0].key;

        State.dropOnStream(state, cardC().meta.key, targetStreamKey, "after");

        expect(state.streams.length).toEqual(2);
        expect(state.streams[0].cards).toEqual([cardA(), cardB()]);
        expect(state.streams[1].cards).toEqual([cardC()]);
    });

    it("normalizes streams after dropping", () => {
        const state = getState();
        // First move all cards out of stream 1, making it empty
        const targetStreamKey = state.streams[0].key;
        State.dropOnStream(state, cardC().meta.key, targetStreamKey, "before");

        // Should have removed the empty stream and normalized
        expect(state.streams.length).toEqual(2);
        expect(state.streams[0].cards).toEqual([cardC()]);
        expect(state.streams[1].cards).toEqual([cardA(), cardB()]);
    });
}); 