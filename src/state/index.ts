import React from "react";
import { Effects, Reducer } from "react-use-elmish";
import { openNote, closeNote, moveNote } from "./streams";
import { setQuery, setResults } from "./search";
import { State, Action } from "./types";

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];

    case "streams/OPEN_NOTE":
      return openNote(state, action);
    case "streams/CLOSE_NOTE":
      return closeNote(state, action);
    case "streams/MOVE_NOTE":
      return moveNote(state, action);

    case "search/SET_QUERY":
      return setQuery(state, action);
    case "search/SET_RESULTS":
      return setResults(state, action);
  }
};

export const initialState = (state?: Partial<State>): State => ({
  search: {
    query: "",
    results: [],
  },
  streams: [],
  ...state,
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {},
]);
