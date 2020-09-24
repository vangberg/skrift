import { Streams } from "../../../src/interfaces/streams";

describe("Streams.closeNote", () => {
  let a = { key: 1, noteId: "a" };
  let b = { key: 2, noteId: "b" };

  it("closes note at location", () => {
    let streams: Streams = [{ key: 1, entries: [a, b] }];

    Streams.closeNote(streams, { location: [0, 1] });

    expect(streams[0].entries).toEqual([a]);
  });

  it("closes notes by id", () => {
    let streams: Streams = [
      { key: 1, entries: [a, a, b] },
      { key: 2, entries: [a, b] },
    ];

    Streams.closeNote(streams, { id: "a" });

    expect(streams[0].entries).toEqual([b]);
    expect(streams[1].entries).toEqual([b]);
  });
});
