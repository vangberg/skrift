import { Notes } from "./store";
import produce from "immer";
import React from "react";

export interface State {
  notes: Notes;
  openIds: string[];
}

export type Action =
  | { type: "SET_NOTES"; notes: Notes }
  | { type: "OPEN_NOTE"; id: string }
  | { type: "CLOSE_NOTE"; id: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NOTES":
      return produce(state, draft => {
        draft.notes = action.notes;
      });
    case "OPEN_NOTE":
      return produce(state, ({ openIds }) => {
        const { id } = action;
        if (openIds.indexOf(id) < 0) {
          openIds.push(id);
        }
      });
    case "CLOSE_NOTE":
      return produce(state, draft => {
        const { id } = action;
        draft.openIds = draft.openIds.filter(i => i !== id);
      });
  }

  return state;
};

export const initialState = (): State => ({
  notes: new Map(),
  openIds: []
});

type Context = [State, React.Dispatch<Action>];
export const StateContext = React.createContext<Context>([
  initialState(),
  () => {}
]);
