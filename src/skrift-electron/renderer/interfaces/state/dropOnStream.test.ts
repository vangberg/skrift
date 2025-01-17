import { State } from "./index.js";
import { getState } from "./fixture.js";

describe("dropOnStream", () => {
    it("should create a new stream before target stream", () => {
        const state = getState();
        const sourceKey = state.streams[0].cards[0].meta.key;
        const targetStreamKey = state.streams[1].key;

        State.dropOnStream(state, sourceKey, targetStreamKey, "before");

        expect(state.streams.length).toBe(3);
        expect(state.streams[1].cards.length).toBe(1);
        expect(state.streams[1].cards[0].meta.key).toBe(sourceKey);
        expect(state.streams[0].cards.length).toBe(1);
    });

    it("should create a new stream after target stream", () => {
        const state = getState();
        const sourceKey = state.streams[0].cards[0].meta.key;
        const targetStreamKey = state.streams[1].key;

        State.dropOnStream(state, sourceKey, targetStreamKey, "after");

        expect(state.streams.length).toBe(3);
        expect(state.streams[2].cards.length).toBe(1);
        expect(state.streams[2].cards[0].meta.key).toBe(sourceKey);
        expect(state.streams[0].cards.length).toBe(1);
    });
}); 