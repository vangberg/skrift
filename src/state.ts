import produce from "immer";
import React from "react";
import { NoteID } from "./interfaces/note";
import { Notes } from "./interfaces/notes";

export interface State {
  notes: Notes;
  openIds: NoteID[];
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

export type Action =
  | { type: "SET_NOTES"; notes: Notes }
  | { type: "OPEN_NOTES"; ids: NoteID[] }
  | { type: "OPEN_NOTE"; id: NoteID }
  | { type: "CLOSE_NOTE"; id: NoteID }
  | { type: "@search/SET_QUERY"; query: string }
  | { type: "@search/SET_RESULTS"; results: NoteID[] }
  | { type: "@search/CLEAR_RESULTS" };

const openNote = (state: State, id: string): State => {
  return produce(state, ({ openIds }) => {
    if (openIds.indexOf(id) < 0) {
      openIds.push(id);
    }
  });
};

export const reducer = (state: State, action: Action): State => {
  console.log(action);

  switch (action.type) {
    case "SET_NOTES":
      return produce(state, draft => {
        draft.notes = action.notes;
        draft.openIds = draft.openIds.filter(id => draft.notes.has(id));
      });
    case "OPEN_NOTES":
      return action.ids.reduce((state, id) => openNote(state, id), state);
    case "OPEN_NOTE":
      return openNote(state, action.id);
    case "CLOSE_NOTE":
      return produce(state, draft => {
        const { id } = action;
        draft.openIds = draft.openIds.filter(i => i !== id);
      });
    case "@search/SET_QUERY":
      return produce(state, draft => {
        draft.search.query = action.query;
      });
    case "@search/SET_RESULTS":
      return produce(state, draft => {
        draft.search.results = action.results;
      });
    case "@search/CLEAR_RESULTS":
      return produce(state, draft => {
        draft.search.results = null;
      });
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
