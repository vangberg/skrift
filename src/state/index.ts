import React from "react";
import { Effects, Reducer } from "react-use-elmish";
import { openFolder, setNotes, saveMarkdown, deleteNote } from "./notes";
import { openNote, closeNote } from "./streams";
import { setQuery, setResults, clearSearch } from "./search";
import { State, Action } from "./types";

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "ERROR":
      console.log(action);
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
    case "search/CLEAR":
      return clearSearch(state, action);
  }
};

export const initialState = (state?: Partial<State>): State => ({
  search: {
    query: "",
    results: null,
  },
  notes: new Map(),
  streams: [],
  ...state,
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {},
]);
