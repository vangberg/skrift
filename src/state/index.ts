import React from "react";
import { Effects, Reducer } from "react-use-elmish";
import { openNote, closeNote } from "./streams";
import { setQuery, setResults, clearSearch } from "./search";
import {
  State,
  Action,
  SetNotesAction,
  ActionHandler,
  NoteCache,
} from "./types";
import { remote } from "electron";
import path from "path";
import produce from "immer";

export const setNotes: ActionHandler<SetNotesAction> = (state, action) => {
  const notes: NoteCache = new Map();

  action.notes.forEach((note) => {
    const { id, title, modifiedAt } = note;

    notes.set(id, { id, title, modifiedAt });
  });

  return [
    produce(state, (draft) => {
      draft.notes = notes;
    }),
    Effects.none(),
  ];
};

export const reducer: Reducer<State, Action> = (state, action) => {
  console.log(action);

  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];

    case "notes/SET_NOTES":
      return setNotes(state, action);

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
