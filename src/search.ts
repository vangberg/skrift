import { Store } from "./store";
import FlexSearch from "flexsearch";
import { NoteID, Note } from "./interfaces/note";
import React from "react";
import { Notes } from "./interfaces/notes";

export class Search {
  index: any;

  constructor() {
    // @ts-ignore
    this.index = new FlexSearch({ worker: true });
  }

  add(id: NoteID, note: Note) {
    this.index.add(id, note.markdown);
  }

  async search(query: string): Promise<NoteID[]> {
    return new Promise((resolve, reject) => {
      this.index.search(query, 20, (result: string[]) => resolve(result));
    });
  }

  subscribe(store: Store) {
    const unsubscribe = store.events.update.subscribe(ids => {
      console.log("Indexing notes", ids.length);
      ids.forEach(id => {
        const note = Notes.getNote(store.notes, id);
        this.add(id, note);
      });
    });
    return unsubscribe;
  }
}

export const SearchContext = React.createContext(new Search());
