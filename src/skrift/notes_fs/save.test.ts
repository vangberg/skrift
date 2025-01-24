import { describe, expect, test, beforeAll, beforeEach, afterEach } from 'vitest';
import path from "path";
import { NotesFS } from "./index.js";
import fs from "fs";

describe("NotesFS.save", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.promises.mkdtemp("skrift-test");
  });

  afterEach(async () => {
    await fs.promises.rmdir(dir, { recursive: true });
  });

  test("saves note", async () => {
    const id = "2020-10-06T131612.751Z.md";
    await NotesFS.save(dir, id, "");

    expect(fs.existsSync(path.join(dir, id))).toEqual(true);
  });
});
