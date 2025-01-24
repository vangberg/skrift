import { describe, expect, test } from "vitest";
import { Path } from "./index.js";

describe("Path.equals", () => {
  test("is true", () => {
    const p1: Path = [0, 1];
    const p2: Path = [0, 1];

    expect(Path.equals(p1, p2)).toEqual(true);
  });

  test("is false", () => {
    const p1: Path = [0, 1];
    const p2: Path = [0, 2];

    expect(Path.equals(p1, p2)).toEqual(false);
  });
});
