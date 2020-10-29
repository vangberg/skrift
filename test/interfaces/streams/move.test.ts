import { StreamCard, Streams } from "../../../src/interfaces/streams";

describe("Streams.move", () => {
  let a: StreamCard = { key: 1, type: "note", id: "a" };
  let b: StreamCard = { key: 2, type: "note", id: "b" };
  let c: StreamCard = { key: 3, type: "search", query: "abc", results: [] };

  it("moves within a stream", () => {
    let streams: Streams = [{ key: 1, cards: [a, b, c] }];

    Streams.move(streams, [0, 0], [0, 2]);

    expect(streams[0].cards).toEqual([b, c, a]);
  });

  it("moves between streams", () => {
    let streams: Streams = [
      { key: 1, cards: [a, b] },
      { key: 2, cards: [c] },
    ];

    Streams.move(streams, [0, 0], [1, 1]);

    expect(streams[0].cards).toEqual([b]);
    expect(streams[1].cards).toEqual([c, a]);
  });
});
