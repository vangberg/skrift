import { describe, expect, test } from 'vitest'

import { Note } from "./index.js";

describe("Note.idFromDate", () => {
  test("generates suitable string", () => {
    const date = new Date(Date.UTC(2020, 0, 2, 3, 4, 5, 6));
    const id = Note.idFromDate(date);

    expect(id).toEqual("20200102T030405.006Z.md");
  });
});
