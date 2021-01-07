import { Path } from ".";

describe("Path.equals", () => {
  it("is true", () => {
    const p1 = [0, 1, 2];
    const p2 = [0, 1, 2];

    expect(Path.equals(p1, p2)).toEqual(true);
  });

  it("is false", () => {
    const p1 = [0, 1, 2];
    const p2 = [0, 1, 3];

    expect(Path.equals(p1, p2)).toEqual(false);
  });
});
