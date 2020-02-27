import FlexSearch from "flexsearch";
import { NoteID } from "./interfaces/note";
import React, { Dispatch } from "react";
import { Action } from "./state";

interface Index {
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

  dispatchWithSearch(
    dispatch: Dispatch<Action>,
    index: Index
  ): Dispatch<Action> {
    return (action: Action) => {
      switch (action.type) {
        case "SET_NOTES":
          action.notes.forEach(note => index.add(note.id, note.markdown));
          break;
        case "SAVE_MARKDOWN":
          index.add(action.id, action.markdown);
          break;
        case "DELETE_NOTE":
          index.remove(action.id);
          break;
      }

      return dispatch(action);
    };
  },

  async search(index: Index, query: string): Promise<NoteID[]> {
    return new Promise(resolve => {
      index.search(query, 20, (result: string[]) => resolve(result));
    });
  }
};

export const SearchContext = React.createContext(Search.makeIndex());
