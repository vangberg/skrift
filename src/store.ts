import React from "react";
import { Note, NoteID } from "./interfaces/note";
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
  };

  constructor() {
    this.notes = new Map();
    this.events = {
      update: new TypedEvent()
    };
  }

  async readAll(): Promise<void> {
    const filenames = await fs.promises.readdir(PATH);
    await Promise.all(
      filenames.map(id =>
        fs.promises.readFile(path.join(PATH, id), "utf8").then(markdown => {
          const note = {
            ...Note.empty({ id }),
            ...Note.fromMarkdown(markdown)
          };
          this.notes = produce(this.notes, draft => {
            Notes.setNote(draft, note);
          });
        })
      )
    );
    this.notes.forEach(note => {
      this.notes = produce(this.notes, draft => {
        Notes.linksToBacklinks(draft, note.id);
      });
    });
    this.events.update.emit([...this.notes.keys()]);
  }

  get(id: string): Note {
    const note = this.notes.get(id);

    if (!note) {
      throw new Error(`Could not find note with id ${id}`);
    }

    return note;
  }

  save(note: Note) {
    this.notes = produce(this.notes, draft => {
      Notes.setNote(draft, note);
      Notes.linksToBacklinks(draft, note.id);
    });

    fs.promises.writeFile(path.join(PATH, note.id), note.markdown);
    this.events.update.emit([note.id]);
  }

  updateMarkdown(id: string, markdown: string) {
    const note = this.get(id) || Note.empty({ id });
    const next = { ...note, ...Note.fromMarkdown(markdown) };

    this.save(next);
  }

  generate(markdown?: string): Note {
    const id = new Date().toJSON();

    const note = {
      ...Note.empty({ id }),
      ...(markdown ? Note.fromMarkdown(markdown) : {})
    };

    this.save(note);

    return note;
  }
}

export const StoreContext = React.createContext(new Store());
