import { Note } from ".";

describe("Note.idFromDate", () => {
  it("generates suitable string", () => {
    const date = new Date(Date.UTC(2020, 0, 2, 3, 4, 5, 6));
    const id = Note.idFromDate(date);

    expect(id).toEqual("20200102T030405.006Z.md");
  });
});
