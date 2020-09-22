import { Streams } from "../../../src/interfaces/streams";

describe("Streams.closeNote", () => {
  let a = { key: 1, noteId: "a" };
  let b = { key: 2, noteId: "b" };

  it("closes note at location", () => {
    let streams: Streams = [[a, b]];

    Streams.closeNote(streams, { location: [0, 1] });

    expect(streams).toEqual([[a]]);
  });

  it("closes notes by id", () => {
    let streams: Streams = [
      [a, a, b],
      [a, b],
    ];

    Streams.closeNote(streams, { id: "a" });

    expect(streams).toEqual([[b], [b]]);
  });
});
