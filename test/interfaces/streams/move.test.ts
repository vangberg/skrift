import { Streams } from "../../../src/interfaces/streams";

describe("Streams.move", () => {
  let a = { key: 1, noteId: "a" };
  let b = { key: 2, noteId: "b" };
  let c = { key: 3, noteId: "c" };

  it("moves within a stream", () => {
    let streams: Streams = [{ key: 1, entries: [a, b, c] }];

    Streams.move(streams, [0, 0], [0, 2]);

    expect(streams[0].entries).toEqual([b, c, a]);
  });

  it("moves between streams", () => {
    let streams: Streams = [
      { key: 1, entries: [a, b] },
      { key: 2, entries: [c] },
    ];

    Streams.move(streams, [0, 0], [1, 1]);

    expect(streams[0].entries).toEqual([b]);
    expect(streams[1].entries).toEqual([c, a]);
  });
});
