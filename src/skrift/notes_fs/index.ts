import fs from "fs";
import path from "path";
import { NoteID, Note } from "../note";

export const NotesFS = {
  path(dirPath: string, id: NoteID): string {
    return path.join(dirPath, id);
  },

  async initialize(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });

      const docsPath = path.join(process.resourcesPath, "docs");

      if (fs.existsSync(docsPath)) {
        const notes = (await fs.promises.readdir(docsPath)).filter((filename) =>
          filename.endsWith(".md")
        );

        await Promise.all(
          notes.map(async (note) => {
            const from = path.join(docsPath, note);
            const to = path.join(dirPath, note);
            return fs.promises.copyFile(from, to);
          })
        );
      }
    }

    return Promise.resolve();
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

    for (const id of ids) {
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
