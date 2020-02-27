import fs from "fs";
import path from "path";
import os from "os";
import { NoteID } from "../note";
import { Notes } from "../notes";

const PATH = path.join(os.homedir(), "Documents", "zettelkasten");

export const NotesFS = {
  path(id: NoteID): string {
    return path.join(PATH, id + ".md");
  },

  async readAll(): Promise<Notes> {
    const filenames = await fs.promises.readdir(PATH);
    const notes = new Map();

    await Promise.all(
      filenames
        .filter(filename => filename.endsWith(".md"))
        .map(async filename => {
          const markdown = await fs.promises.readFile(
            path.join(PATH, filename),
            "utf8"
          );
          Notes.saveMarkdown(notes, path.basename(filename, ".md"), markdown);
        })
    );
    notes.forEach(note => Notes.addBacklinks(notes, note.id));
    return notes;
  },

  save(notes: Notes, id: NoteID): Promise<void> {
    const note = Notes.getNote(notes, id);

    if (!note) {
      return Promise.reject(`Could not save note ${id} - note does not exist`);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(this.path(note.id), note.markdown, err => {
        err ? reject(err) : resolve();
      });
    });
  },

  delete(id: NoteID): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(this.path(id), err => {
        err ? reject(err) : resolve();
      });
    });
  }
};
