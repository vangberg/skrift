import fs from "fs";
import path from "path";
import { NoteID, Note } from "../note";
import { Notes } from "../notes";
import { remote } from "electron";

const PATH = path.join(remote.app.getPath("documents"), "Skrift");

export const NotesFS = {
  path(id: NoteID): string {
    return path.join(PATH, id + ".md");
  },

  initialize(): Promise<void> {
    return fs.promises.mkdir(PATH, { recursive: true });
  },

  async readAll(): Promise<Notes> {
    const filenames = await fs.promises.readdir(PATH);
    const notes = new Map();

    await Promise.all(
      filenames
        .filter((filename) => filename.endsWith(".md"))
        .map(async (filename) => {
          const fullPath = path.join(PATH, filename);
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
