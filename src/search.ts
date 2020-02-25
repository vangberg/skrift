import { Store } from "./store";
import FlexSearch from "flexsearch";
import { NoteID, Note } from "./interfaces/note";
import React from "react";
import { Notes } from "./interfaces/notes";

export class Search {
  index: any;

  constructor() {
    // @ts-ignore
    this.index = new FlexSearch();
  }

  add(id: NoteID, note: Note) {
    this.index.add(id, note.markdown);
  }

  async search(query: string): Promise<NoteID[]> {
    return new Promise(resolve => {
      this.index.search(query, 20, (result: string[]) => resolve(result));
    });
  }

  subscribe(store: Store) {
    const updateUnsubscribe = store.events.update.subscribe(ids => {
      ids.forEach(id => {
        const note = Notes.getNote(store.notes, id);
        if (note) {
          this.add(id, note);
        }
      });
    });
    const deleteUnsubscribe = store.events.delete.subscribe(ids => {
      ids.forEach(id => this.index.remove(id));
    });

    return () => {
      updateUnsubscribe();
      deleteUnsubscribe();
    };
  }
}

export const SearchContext = React.createContext(new Search());
