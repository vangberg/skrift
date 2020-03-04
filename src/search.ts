import FlexSearch from "flexsearch";
import { NoteID, Note } from "./interfaces/note";
import { Notes } from "./interfaces/notes";

export interface Index {
  add(id: string, item: string): void;
  remove(id: string): void;
  search(
    query: string,
    limit: number,
    callback: (result: string[]) => void
  ): void;
}

export const Search = {
  makeIndex(): Index {
    return new FlexSearch() as Index;
  },

  replaceAll(index: Index, notes: Notes) {
    notes.forEach(note => index.add(note.id, note.markdown));
  },

  add(index: Index, note: Note) {
    index.add(note.id, note.markdown);
  },

  remove(index: Index, id: NoteID) {
    index.remove(id);
  },

  async search(index: Index, query: string): Promise<NoteID[]> {
    return new Promise(resolve => {
      index.search(query, 20, (result: string[]) => resolve(result));
    });
  }
};
