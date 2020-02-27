import produce from "immer";
import React from "react";
import { Effects, Reducer, StateEffectPair } from "react-use-elmish";
import { NoteID } from "./interfaces/note";
import { Notes } from "./interfaces/notes";
import { NotesFS } from "./interfaces/notes_fs";

export interface State {
  notes: Notes;
  openIds: NoteID[];
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

type ErrorAction = {
  type: "ERROR";
  message: string;
};

type SaveMarkdownAction = {
  type: "SAVE_MARKDOWN";
  id: NoteID;
  markdown: string;
};

type DeleteNoteAction = { type: "DELETE_NOTE"; id: NoteID };

export type Action =
  | { type: "SET_NOTES"; notes: Notes }
  | { type: "OPEN_NOTES"; ids: NoteID[] }
  | SaveMarkdownAction
  | DeleteNoteAction
  | { type: "OPEN_NOTE"; id: NoteID }
  | { type: "CLOSE_NOTE"; id: NoteID }
  | { type: "@search/SET_QUERY"; query: string }
  | { type: "@search/SET_RESULTS"; results: NoteID[] }
  | { type: "@search/CLEAR_RESULTS" }
  | ErrorAction;

const openNote = (state: State, id: string): State => {
  return produce(state, ({ openIds }) => {
    if (openIds.indexOf(id) < 0) {
      openIds.push(id);
    }
  });
};

const errorAction = (message: string): ErrorAction => {
  return { type: "ERROR", message };
};

const saveMarkdown = (
  state: State,
  action: SaveMarkdownAction
): StateEffectPair<State, Action> => {
  const next = produce(state, draft => {
    Notes.saveMarkdown(draft.notes, action.id, action.markdown);
  });

  return [
    next,
    Effects.attemptPromise(
      () => NotesFS.save(next.notes, action.id),
      err => errorAction(err.message)
    )
  ];
};

const deleteNote = (
  state: State,
  action: DeleteNoteAction
): StateEffectPair<State, Action> => {
  return [
    produce(state, draft => {
      Notes.deleteNote(draft.notes, action.id);
    }),
    Effects.attemptPromise(
      () => NotesFS.delete(action.id),
      err => errorAction(err.message)
    )
  ];
};

export const reducer: Reducer<State, Action> = (state, action) => {
  console.log(action);

  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];
    case "SET_NOTES":
      return [
        produce(state, draft => {
          draft.notes = action.notes;
          draft.openIds = draft.openIds.filter(id => draft.notes.has(id));
        }),
        Effects.none()
      ];
    case "OPEN_NOTES":
      return [
        action.ids.reduce((state, id) => openNote(state, id), state),
        Effects.none()
      ];
    case "SAVE_MARKDOWN":
      return saveMarkdown(state, action);
    case "DELETE_NOTE":
      return deleteNote(state, action);
    case "OPEN_NOTE":
      return [openNote(state, action.id), Effects.none()];
    case "CLOSE_NOTE":
      return [
        produce(state, draft => {
          const { id } = action;
          draft.openIds = draft.openIds.filter(i => i !== id);
        }),
        Effects.none()
      ];
    case "@search/SET_QUERY":
      return [
        produce(state, draft => {
          draft.search.query = action.query;
        }),
        Effects.none()
      ];
    case "@search/SET_RESULTS":
      return [
        produce(state, draft => {
          draft.search.results = action.results;
        }),
        Effects.none()
      ];
    case "@search/CLEAR_RESULTS":
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
