import { Streams } from "../../../src/interfaces/streams";

describe("Streams.collapse", () => {
  let a = { key: 1, noteId: "a" };

  it("closes all empty streams", () => {
    let streams: Streams = [
      { key: 1, entries: [] },
      { key: 2, entries: [a] },
      { key: 3, entries: [] },
    ];

    Streams.collapse(streams);

    expect(streams).toEqual([{ key: 2, entries: [a] }]);
  });
});
