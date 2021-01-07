import { Path } from ".";

describe("Path.ancestor", () => {
  it("returns ancestor", () => {
    const path = [0, 1, 2];

    expect(Path.ancestor(path)).toEqual([0, 1]);
  });
});
