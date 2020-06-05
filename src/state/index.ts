import React from "react";
import { Effects, Reducer } from "react-use-elmish";
import { setNotes, setNote } from "./notes";
import { openNote, closeNote } from "./streams";
import { setQuery, setResults, clearSearch } from "./search";
import { State, Action } from "./types";
import { remote } from "electron";
import path from "path";

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];

    case "notes/SET_NOTES":
      return setNotes(state, action);
    case "notes/SET_NOTE":
      return setNote(state, action);

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
  path: path.join(remote.app.getPath("documents"), "Skrift"),
  notes: new Map(),
  search: {
    query: "",
    results: null,
  },
  streams: [],
  ...state,
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {},
]);
