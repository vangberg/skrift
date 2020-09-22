import { Streams } from "../../../src/interfaces/streams";

describe("Streams.collapse", () => {
  let a = { key: 1, noteId: "a" };

  it("closes all empty streams", () => {
    let streams: Streams = [[], [a], []];

    Streams.collapse(streams);

    expect(streams).toEqual([[a]]);
  });
});
