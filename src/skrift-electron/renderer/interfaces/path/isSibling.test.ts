import { Path } from ".";

describe("Path.isSibling", () => {
  it("is false for self", () => {
    const p1 = [0, 1, 2];
    const p2 = [0, 1, 2];

    expect(Path.isSibling(p1, p2)).toEqual(false);
  });

  it("is false for non siblings", () => {
    const p1 = [0, 1, 2];
    const p2 = [0, 2, 2];

    expect(Path.isSibling(p1, p2)).toEqual(false);
  });

  it("is true for siblings", () => {
    const p1 = [0, 1, 2];
    const p2 = [0, 1, 3];

    expect(Path.isSibling(p1, p2)).toEqual(true);
  });
});
