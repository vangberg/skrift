import { NoteID, Note } from "./interfaces/note";
import { useEffect, useContext } from "react";
import produce from "immer";
import React from "react";
import { NotesFS } from "./interfaces/notes_fs";
import useElmish, { Reducer, StateEffectPair, Effects } from "react-use-elmish";
import { ipcRenderer } from "electron";
import { IpcLoadedNote, IpcLoadNote } from "./types";

type Notes = Map<NoteID, Note>;

interface State {
  path: string;
  notes: Notes;
}

type LoadNoteAction = { type: "LOAD_NOTE"; id: NoteID };
type LoadedNoteAction = { type: "LOADED_NOTE"; note: Note };
type SetNoteAction = { type: "SET_NOTE"; id: NoteID; markdown: string };
type DeleteNoteAction = { type: "DELETE_NOTE"; id: NoteID };
type ErrorAction = { type: "ERROR"; message: string };

type Action =
  | LoadNoteAction
  | LoadedNoteAction
  | SetNoteAction
  | DeleteNoteAction
  | ErrorAction;

type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;

const errorHandler = (error: Error): Action => {
  return { type: "ERROR", message: error.message };
};

const loadNote: ActionHandler<LoadNoteAction> = (state, action) => {
  const { path } = state;
  const { id } = action;

  const ipcMessage: IpcLoadNote = { path, id };

  return [
    state,
    Effects.fromPromise(
      () => ipcRenderer.invoke("load-note", ipcMessage),
      (note: Note) => ({ type: "LOADED_NOTE", note }),
      errorHandler
    ),
  ];
};

const loadedNote: ActionHandler<LoadedNoteAction> = (state, action) => {
  const { note } = action;

  return [
    produce(state, (draft) => {
      draft.notes.set(note.id, note);
    }),
    Effects.none(),
  ];
};

const setNote: ActionHandler<SetNoteAction> = (state, action) => {
  const { path } = state;
  const { id, markdown } = action;
  const note = { ...Note.empty({ id }), ...Note.fromMarkdown(markdown) };

  return [
    produce(state, (draft) => {
      draft.notes.set(id, note);
    }),
    Effects.attemptPromise(
      () => NotesFS.save(path, id, markdown),
      errorHandler
    ),
  ];
};

const deleteNote: ActionHandler<DeleteNoteAction> = (state, action) => {
  const { path } = state;
  const { id } = action;

  return [
    produce(state, (draft) => {
      draft.notes.delete(id);
    }),
    Effects.attemptPromise(() => NotesFS.delete(path, id), errorHandler),
  ];
};

const reducer: Reducer<State, Action> = (state, action) => {
  console.log(action);

  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];
    case "LOAD_NOTE":
      return loadNote(state, action);
    case "LOADED_NOTE":
      return loadedNote(state, action);
    case "SET_NOTE":
      return setNote(state, action);
    case "DELETE_NOTE":
      return deleteNote(state, action);
  }
};

export const initialState = (path: string): State => ({
  path,
  notes: new Map(),
});

interface NoteCache {
  notes: Notes;
  loadNote: (id: NoteID) => void;
  setNote: (id: NoteID, markdown: string) => void;
  deleteNote: (id: NoteID) => void;
}

export const useNoteCache = (path: string): NoteCache => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(path),
    Effects.none(),
  ]);

  return {
    notes: state.notes,
    loadNote: (id) => dispatch({ type: "LOAD_NOTE", id }),
    setNote: (id, markdown) => dispatch({ type: "SET_NOTE", id, markdown }),
    deleteNote: (id) => dispatch({ type: "DELETE_NOTE", id }),
  };
};

export const useNote = (id: NoteID): Note | null => {
  const cache = useContext(NoteCacheContext);

  useEffect(() => {
    cache.loadNote(id);
  }, []);

  return cache.notes.get(id) || null;
};

export const NoteCacheContext = React.createContext<NoteCache>({
  notes: new Map(),
  loadNote: (id) => Promise.resolve(),
  setNote: (id, markdown) => {},
  deleteNote: (id) => {},
});
