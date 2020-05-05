import fs, { read } from "fs";
import path from "path";
import { NoteID, Note } from "../note";
import { Notes } from "../notes";
import { remote } from "electron";

const getPath = () => path.join(remote.app.getPath("documents"), "Skrift");

export const NotesFS = {
  path(id: NoteID): string {
    return path.join(getPath(), id + ".md");
  },

  async initialize(): Promise<void> {
    await fs.promises.mkdir(getPath(), { recursive: true });
  },

  async read(filePath: string): Promise<Note> {
    const id = path.basename(filePath, ".md");

    const [stats, markdown] = await Promise.all([
      fs.promises.stat(filePath),
      fs.promises.readFile(filePath, "utf8"),
    ]);

    return Note.empty({
      ...Note.fromMarkdown(markdown),
      id,
      modifiedAt: stats.mtime,
    });
  },

  async *readDir(dirPath: string): AsyncGenerator<Note, void> {
    const filenames = (await fs.promises.readdir(dirPath)).filter((filename) =>
      filename.endsWith(".md")
    );

    for (let filename of filenames) {
      const fullPath = path.join(dirPath, filename);
      yield await NotesFS.read(fullPath);
    }
  },

  async readAll(): Promise<Notes> {
    const filenames = await fs.promises.readdir(getPath());
    const notes = new Map();

    await Promise.all(
      filenames
        .filter((filename) => filename.endsWith(".md"))
        .map(async (filename) => {
          const fullPath = path.join(getPath(), filename);
          const [stats, markdown] = await Promise.all([
            fs.promises.stat(fullPath),
            fs.promises.readFile(fullPath, "utf8"),
          ]);

          const id = path.basename(filename, ".md");
          const note = Note.empty({
            ...Note.fromMarkdown(markdown),
            id,
            modifiedAt: stats.mtime,
          });

          Notes.saveNote(notes, note);
        })
    );
    notes.forEach((note) => Notes.addBacklinks(notes, note.id));
    return notes;
  },

  save(notes: Notes, id: NoteID): Promise<void> {
    const note = Notes.getNote(notes, id);

    if (!note) {
      return Promise.reject(`Could not save note ${id} - note does not exist`);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(this.path(note.id), note.markdown, (err) => {
        err ? reject(err) : resolve();
      });
    });
  },

  delete(id: NoteID): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(this.path(id), (err) => {
        err ? reject(err) : resolve();
      });
    });
  },
};
