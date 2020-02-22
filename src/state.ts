import { Notes } from "./interfaces/notes";
import produce from "immer";
import React from "react";

export interface State {
  notes: Notes;
  openIds: string[];
}

export type Action =
  | { type: "SET_NOTES"; notes: Notes }
  | { type: "OPEN_NOTES"; ids: string[] }
  | { type: "OPEN_NOTE"; id: string }
  | { type: "CLOSE_NOTE"; id: string };

const openNote = (state: State, id: string): State => {
  return produce(state, ({ openIds }) => {
    if (openIds.indexOf(id) < 0) {
      openIds.push(id);
    }
  });
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NOTES":
      return produce(state, draft => {
        draft.notes = action.notes;
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
  }

  return state;
};

export const initialState = (state?: Partial<State>): State => ({
  notes: new Map(),
  openIds: [],
  ...state
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {}
]);
