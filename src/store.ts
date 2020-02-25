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
      filenames.map(id =>
        fs.promises.readFile(this.path(id), "utf8").then(markdown => {
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

  save(note: Note): void {
    this.notes = produce(this.notes, draft => {
      Notes.setNote(draft, note);
      Notes.linksToBacklinks(draft, note.id);
    });

    fs.promises.writeFile(this.path(note.id), note.markdown);
    this.events.update.emit([note.id]);
  }

  updateMarkdown(id: string, markdown: string): void {
    const note = this.notes.get(id) || Note.empty({ id });
    const next = { ...note, ...Note.fromMarkdown(markdown) };

    this.save(next);
  }

  delete(id: NoteID): void {
    this.notes = produce(this.notes, draft => {
      Notes.deleteNote(draft, id);
    });

    fs.promises.unlink(this.path(id));
    this.events.delete.emit([id]);
  }

  path(id: NoteID): string {
    return path.join(PATH, id);
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
