import produce from "immer";
import React from "react";
import { Effects, Reducer, StateEffectPair } from "react-use-elmish";
import { NoteID } from "./interfaces/note";
import { Notes } from "./interfaces/notes";
import { NotesFS } from "./interfaces/notes_fs";
import { Search, Index } from "./search";

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

type NotesAction =
  | OpenFolderAction
  | SetNotesAction
  | SaveMarkdownAction
  | DeleteNoteAction;
type OpenFolderAction = { type: "notes/OPEN_FOLDER" };
type SetNotesAction = { type: "notes/SET_NOTES"; notes: Notes };
type SaveMarkdownAction = {
  type: "notes/SAVE_MARKDOWN";
  id: NoteID;
  markdown: string;
};
type DeleteNoteAction = { type: "notes/DELETE_NOTE"; id: NoteID };

type StreamsAction = OpenNotesAction | OpenNoteAction | CloseNoteAction;
type OpenNotesAction = { type: "streams/OPEN_NOTES"; ids: NoteID[] };
type OpenNoteAction = { type: "streams/OPEN_NOTE"; id: NoteID };
type CloseNoteAction = { type: "streams/CLOSE_NOTE"; index: number };

type SearchAction = SetQueryAction | SetResultsAction | ClearResultsAction;
type SetQueryAction = { type: "search/SET_QUERY"; query: string };
type SetResultsAction = { type: "search/SET_RESULTS"; results: NoteID[] };
type ClearResultsAction = { type: "search/CLEAR_RESULTS" };

export type Action = NotesAction | StreamsAction | SearchAction | ErrorAction;

const openNote = (state: State, id: string): State => {
  return produce(state, ({ openIds }) => {
    openIds.push(id);
  });
};

const errorHandler = (error: Error): ErrorAction => {
  return { type: "ERROR", message: error.message };
};

const openFolder = (
  state: State,
  action: OpenFolderAction
): StateEffectPair<State, Action> => {
  action;
  return [
    state,
    Effects.dispatchFromPromise<Action>(async () => {
      const notes = await NotesFS.readAll();
      return { type: "notes/SET_NOTES", notes };
    }, errorHandler)
  ];
};

const setNotes = (
  index: Index,
  state: State,
  action: SetNotesAction
): StateEffectPair<State, Action> => {
  return [
    produce(state, draft => {
      draft.notes = action.notes;
      draft.openIds = draft.openIds.filter(id => draft.notes.has(id));
    }),
    Effects.attemptFunction(
      () => Search.replaceAll(index, action.notes),
      errorHandler
    )
  ];
};

const saveMarkdown = (
  index: Index,
  state: State,
  action: SaveMarkdownAction
): StateEffectPair<State, Action> => {
  const next = produce(state, draft => {
    Notes.saveMarkdown(draft.notes, action.id, action.markdown);
  });

  const note = Notes.getNote(next.notes, action.id)!;

  return [
    next,
    Effects.combine(
      Effects.attemptPromise(
        () => NotesFS.save(next.notes, action.id),
        errorHandler
      ),
      Effects.attemptFunction(() => Search.add(index, note), errorHandler)
    )
  ];
};

const deleteNote = (
  index: Index,
  state: State,
  action: DeleteNoteAction
): StateEffectPair<State, Action> => {
  return [
    produce(state, draft => {
      Notes.deleteNote(draft.notes, action.id);
    }),
    Effects.combine(
      Effects.attemptPromise(() => NotesFS.delete(action.id), errorHandler),
      Effects.attemptFunction(
        () => Search.remove(index, action.id),
        errorHandler
      )
    )
  ];
};

const closeNote = (
  state: State,
  action: CloseNoteAction
): StateEffectPair<State, Action> => {
  return [
    produce(state, draft => {
      const { index } = action;
      draft.openIds.splice(index, 1);
    }),
    Effects.none()
  ];
};

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
      return setNotes(index, state, action);
    case "streams/OPEN_NOTES":
      return [
        action.ids.reduce((state, id) => openNote(state, id), state),
        Effects.none()
      ];
    case "notes/SAVE_MARKDOWN":
      return saveMarkdown(index, state, action);
    case "notes/DELETE_NOTE":
      return deleteNote(index, state, action);
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
