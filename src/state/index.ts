import produce from "immer";
import React from "react";
import { Effects, Reducer, StateEffectPair } from "react-use-elmish";
import { NoteID } from "../interfaces/note";
import { Notes } from "../interfaces/notes";
import { NotesFS } from "../interfaces/notes_fs";
import { Search, Index } from "../search";
import { openFolder, setNotes, saveMarkdown, deleteNote } from "./notes";
import { Action } from "./types";

export interface State {
  notes: Notes;
  openIds: NoteID[];
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

// const openNote = (state: State, id: string): State => {
//   return produce(state, ({ openIds }) => {
//     openIds.push(id);
//   });
// };

// const closeNote = (
//   state: State,
//   action: CloseNoteAction
// ): StateEffectPair<State, Action> => {
//   return [
//     produce(state, draft => {
//       const { index } = action;
//       draft.openIds.splice(index, 1);
//     }),
//     Effects.none()
//   ];
// };

export const makeReducer: (index: Index) => Reducer<State, Action> = index => (
  state,
  action
) => {
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

    case "streams/OPEN_NOTES":
      return [
        action.ids.reduce((state, id) => openNote(state, id), state),
        Effects.none()
      ];
    case "streams/OPEN_NOTE":
      return [openNote(state, action.id), Effects.none()];
    case "streams/CLOSE_NOTE":
      return closeNote(state, action);

    case "search/SET_QUERY":
      return [
        produce(state, draft => {
          draft.search.query = action.query;
        }),
        Effects.none()
      ];
    case "search/SET_RESULTS":
      return [
        produce(state, draft => {
          draft.search.results = action.results;
        }),
        Effects.none()
      ];
    case "search/CLEAR_RESULTS":
      return [
        produce(state, draft => {
          draft.search.results = null;
        }),
        Effects.none()
      ];
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
