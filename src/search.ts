import { Store } from "./store";
import FlexSearch from "flexsearch";
import { NoteID, Note } from "./interfaces/note";
import React from "react";

export class Search {
  index: any;
  unsubscribe: () => void;

  constructor(store: Store) {
    // @ts-ignore
    this.index = new FlexSearch({ worker: true });
    this.unsubscribe = store.events.update.subscribe(ids => {
      ids.forEach(id => {
        const note = store.get(id);
        this.add(id, note);
      });
    });
  }

  add(id: NoteID, note: Note) {
    this.index.add(id, note.markdown);
  }

  async search(query: string): Promise<NoteID[]> {
    return new Promise((resolve, reject) => {
      this.index.search(query, 20, (result: string[]) => resolve(result));
    });
  }

  teardown() {
    this.unsubscribe();
  }
}

export const SearchContext = React.createContext(new Search(new Store()));
