import { StreamCard, Streams } from ".";

describe("Streams.closeNote", () => {
  let a: StreamCard = { key: 1, type: "note", id: "a" };
  let b: StreamCard = { key: 2, type: "note", id: "b" };

  it("closes note at location", () => {
    let streams: Streams = [{ key: 1, cards: [a, b] }];

    Streams.closeNote(streams, { location: [0, 1] });

    expect(streams[0].cards).toEqual([a]);
  });

  it("closes notes by id", () => {
    let streams: Streams = [
      { key: 1, cards: [a, a, b] },
      { key: 2, cards: [a, b] },
    ];

    Streams.closeNote(streams, { id: "a" });

    expect(streams[0].cards).toEqual([b]);
    expect(streams[1].cards).toEqual([b]);
  });
});
