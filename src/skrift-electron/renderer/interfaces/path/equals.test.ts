import { Path } from ".";

describe("Path.equals", () => {
  it("is true", () => {
    const p1: Path = [0, 1];
    const p2: Path = [0, 1];

    expect(Path.equals(p1, p2)).toEqual(true);
  });

  it("is false", () => {
    const p1: Path = [0, 1];
    const p2: Path = [0, 2];

    expect(Path.equals(p1, p2)).toEqual(false);
  });
});
