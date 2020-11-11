import { StreamCard, Streams } from ".";

describe("Streams.collapse", () => {
  let a: StreamCard = { key: 1, type: "note", id: "a" };

  it("closes all empty streams", () => {
    let streams: Streams = [
      { key: 1, cards: [] },
      { key: 2, cards: [a] },
      { key: 3, cards: [] },
    ];

    Streams.collapse(streams);

    expect(streams).toEqual([{ key: 2, cards: [a] }]);
  });

  it("leaves at least 1 stream", () => {
    let streams: Streams = [
      { key: 1, cards: [] },
      { key: 2, cards: [] },
    ];

    Streams.collapse(streams);

    expect(streams).toEqual([{ key: 1, cards: [] }]);
  });
});
