import React from "react";
import { Note, NoteLink } from "./interfaces/note";
import path from "path";
import os from "os";
import fs from "fs";

export type Notes = Map<string, Note>;
type Callback = () => void;

const PATH = path.join(os.homedir(), "Documents", "zettelkasten");

export class Store {
  notes: Notes;
  callbackCounter: number;
  callbacks: Map<number, Callback>;

  constructor() {
    this.notes = new Map();
    this.callbackCounter = 0;
    this.callbacks = new Map();
  }

  async readAll(): Promise<void> {
    const filenames = await fs.promises.readdir(PATH);
    await Promise.all(
      filenames.map(filename =>
        fs.promises
          .readFile(path.join(PATH, filename), "utf8")
          .then(markdown => {
            const note = Note.fromMarkdown(markdown);
            this.notes.set(filename, note);
          })
      )
    );
    this.notes.forEach((note, id) => this.updateBacklinks(id, note));

    this.triggerCallbacks();
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
    this.notes.set(id, note);
    this.updateBacklinks(id, note);
    fs.promises.writeFile(path.join(PATH, id), note.markdown);
    this.triggerCallbacks();
  }

  generate(markdown?: string): [string, Note] {
    const id = new Date().toJSON();

    const note = markdown
      ? Note.fromMarkdown(markdown)
      : {
          title: "",
          links: [],
          backlinks: new Set<NoteLink>(),
          markdown: ""
        };

    this.save(id, note);

    return [id, note];
  }

  updateBacklinks(id: string, note: Note) {
    note.links.forEach(link => {
      const n = this.notes.get(link.id);
      n.backlinks.add({ id });
    });
  }

  subscribe(callback: Callback): number {
    const id = this.callbackCounter++;
    this.callbacks.set(id, callback);
    return id;
  }

  unsubscribe(id: number) {
    this.callbacks.delete(id);
  }

  triggerCallbacks() {
    this.callbacks.forEach(callback => callback());
  }
}

export const StoreContext = React.createContext(new Store());
