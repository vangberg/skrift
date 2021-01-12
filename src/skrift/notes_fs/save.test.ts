import path from "path";
import { NotesFS } from ".";
import fs from "fs";

describe("NotesFS.save", () => {
  it("saves note", async () => {
    const id = "2020-10-06T131612.751Z";
    const dir = await fs.promises.mkdtemp("skrift-test");
    await NotesFS.save(dir, id, "");

    expect(fs.existsSync(path.join(dir, `${id}.md`))).toEqual(true);
  });
});
