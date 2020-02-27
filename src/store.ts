import React from "react";
import { NoteID } from "./interfaces/note";
import { Notes } from "./interfaces/notes";
import path from "path";
import os from "os";
import fs from "fs";
import produce from "immer";
import { TypedEvent } from "./event";

const PATH = path.join(os.homedir(), "Documents", "zettelkasten");

export class Store {
  notes: Notes;
  events: {
    update: TypedEvent<NoteID[]>;
    delete: TypedEvent<NoteID[]>;
  };

  constructor() {
    this.notes = new Map();
    this.events = {
      update: new TypedEvent(),
      delete: new TypedEvent()
    };
  }

  async readAll(): Promise<void> {
    const filenames = await fs.promises.readdir(PATH);
    await Promise.all(
      filenames
        .filter(filename => filename.endsWith(".md"))
        .map(async filename => {
          const markdown = await fs.promises.readFile(
            path.join(PATH, filename),
            "utf8"
          );
          this.notes = produce(this.notes, draft => {
            Notes.saveMarkdown(draft, path.basename(filename, ".md"), markdown);
          });
        })
    );
    this.notes.forEach(note => {
      this.notes = produce(this.notes, draft => {
        Notes.addBacklinks(draft, note.id);
      });
    });
    this.events.update.emit([...this.notes.keys()]);
  }

  path(id: NoteID): string {
    return path.join(PATH, id + ".md");
  }
}

export const StoreContext = React.createContext(new Store());
