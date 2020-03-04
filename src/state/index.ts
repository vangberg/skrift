import React from "react";
import { Effects, Reducer } from "react-use-elmish";
import { NoteID } from "../interfaces/note";
import { Notes } from "../interfaces/notes";
import { openFolder, setNotes, saveMarkdown, deleteNote } from "./notes";
import { openNote, closeNote } from "./streams";
import { setQuery, setResults, clearResults } from "./search";
import { Action } from "./types";

export interface State {
  notes: Notes;
  openIds: NoteID[];
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];

    case "notes/OPEN_FOLDER":
      return openFolder(state, action);
    case "notes/SET_NOTES":
      return setNotes(state, action);
    case "notes/SAVE_MARKDOWN":
      return saveMarkdown(state, action);
    case "notes/DELETE_NOTE":
      return deleteNote(state, action);

    case "streams/OPEN_NOTE":
      return openNote(state, action);
    case "streams/CLOSE_NOTE":
      return closeNote(state, action);

    case "search/SET_QUERY":
      return setQuery(state, action);
    case "search/SET_RESULTS":
      return setResults(state, action);
    case "search/CLEAR_RESULTS":
      return clearResults(state, action);
  }
};

export const initialState = (state?: Partial<State>): State => ({
  search: {
    query: "",
    results: []
  },
  notes: new Map(),
  openIds: [],
  ...state
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {}
]);
