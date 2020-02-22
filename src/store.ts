import React from "react";
import { Note } from "./interfaces/note";
import { Notes } from "./interfaces/notes";
import path from "path";
import os from "os";
import fs from "fs";
import produce from "immer";
import { TypedEvent } from "./event";

type Callback = () => void;

const PATH = path.join(os.homedir(), "Documents", "zettelkasten");

export class Store {
  notes: Notes;
  events: {
    update: TypedEvent<string>;
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
      filenames.map(filename =>
        fs.promises
          .readFile(path.join(PATH, filename), "utf8")
          .then(markdown => {
            const note = {
              ...Note.empty(),
              ...Note.fromMarkdown(markdown)
            };
            this.notes = produce(this.notes, draft => {
              Notes.setNote(draft, filename, note);
            });
          })
      )
    );
    this.notes.forEach((note, id) => {
      this.notes = produce(this.notes, draft => {
        Notes.linksToBacklinks(draft, id);
      });
    });
  }

  getNotes(): Notes {
    return new Map(this.notes);
  }

  getIds(): string[] {
    return Array.from(this.notes.keys());
  }

  get(id: string): Note {
    const note = this.notes.get(id);

    if (!note) {
      throw new Error(`Could not find note with id ${id}`);
    }

    return note;
  }

  save(id: string, note: Note) {
    this.notes = produce(this.notes, draft => {
      Notes.setNote(draft, id, note);
      Notes.linksToBacklinks(draft, id);
    });

    fs.promises.writeFile(path.join(PATH, id), note.markdown);
    this.events.update.emit(id);
  }

  updateMarkdown(id: string, markdown: string) {
    const note = this.notes.get(id) || Note.empty();
    const next = { ...note, ...Note.fromMarkdown(markdown) };

    this.save(id, next);
  }

  generate(markdown?: string): [string, Note] {
    const id = new Date().toJSON();

    const note = {
      ...Note.empty(),
      ...(markdown ? Note.fromMarkdown(markdown) : {})
    };

    this.save(id, note);

    return [id, note];
  }
}

export const StoreContext = React.createContext(new Store());
