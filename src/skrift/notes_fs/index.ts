import fs from "fs";
import path from "path";
import { NoteID, Note } from "../note";

export const NotesFS = {
  path(dirPath: string, id: NoteID): string {
    return path.join(dirPath, id);
  },

  async initialize(dirPath: string): Promise<void> {
    await fs.promises.mkdir(dirPath, { recursive: true });
  },

  async read(dirPath: string, id: NoteID): Promise<Note> {
    const notePath = this.path(dirPath, id);

    const [stats, markdown] = await Promise.all([
      fs.promises.stat(notePath),
      fs.promises.readFile(notePath, "utf8"),
    ]);

    return Note.empty({
      ...Note.fromMarkdown(markdown),
      id,
      modifiedAt: stats.mtime,
    });
  },

  async *readDir(dirPath: string): AsyncGenerator<Note, void> {
    const ids = await NotesFS.ids(dirPath);

    for (let id of ids) {
      yield await NotesFS.read(dirPath, id);
    }
  },

  async ids(dirPath: string): Promise<NoteID[]> {
    return (await fs.promises.readdir(dirPath)).filter((filename) =>
      filename.endsWith(".md")
    );
  },

  save(dirPath: string, id: NoteID, markdown: string): Promise<void> {
    return fs.promises.writeFile(this.path(dirPath, id), markdown);
  },

  delete(dirPath: string, id: NoteID): Promise<void> {
    return fs.promises.unlink(this.path(dirPath, id));
  },
};
