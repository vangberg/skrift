import { NoteID, Note } from "./interfaces/note";
import { useEffect, useContext, useMemo } from "react";
import produce from "immer";
import React from "react";
import { NotesFS } from "./interfaces/notes_fs";
import useElmish, { Reducer, StateEffectPair, Effects } from "react-use-elmish";
import { ipcRenderer, webContents } from "electron";
import { IpcLoadedNote, IpcLoadNote, IpcSetNote } from "./types";

type Notes = Map<NoteID, Note>;

interface State {
  loaded: boolean;
  path: string;
  notes: Notes;
}

type LoadedDirAction = { type: "LOADED_DIR" };
type LoadNoteAction = { type: "LOAD_NOTE"; id: NoteID };
type LoadedNoteAction = { type: "LOADED_NOTE"; note: Note };
type SetNoteAction = { type: "SET_NOTE"; id: NoteID; markdown: string };
type DeleteNoteAction = { type: "DELETE_NOTE"; id: NoteID };
type ErrorAction = { type: "ERROR"; message: string };

type Action =
  | LoadedDirAction
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
    Effects.attemptFunction(
      () => ipcRenderer.send("load-note", ipcMessage),
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

  const ipcMessage: IpcSetNote = { path, id, markdown };

  return [
    state,
    Effects.attemptFunction(
      () => ipcRenderer.send("set-note", ipcMessage),
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
  //console.log(action);

  switch (action.type) {
    case "ERROR":
      return [state, Effects.none()];
    case "LOADED_DIR":
      return [{ ...state, loaded: true }, Effects.none()];
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
  loaded: false,
  path,
  notes: new Map(),
});

interface NoteCache {
  loaded: boolean;
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

  useEffect(() => {
    ipcRenderer.on("loaded-note", (event, arg: IpcLoadedNote) => {
      const { note } = arg;
      dispatch({ type: "LOADED_NOTE", note });
    });
    ipcRenderer.on("loaded-dir", (event) => {
      dispatch({ type: "LOADED_DIR" });
    });
    ipcRenderer.send("load-dir", path);
  }, []);

  const { loaded, notes } = state;

  return {
    loaded,
    notes,
    loadNote: (id) => dispatch({ type: "LOAD_NOTE", id }),
    setNote: (id, markdown) => dispatch({ type: "SET_NOTE", id, markdown }),
    deleteNote: (id) => dispatch({ type: "DELETE_NOTE", id }),
  };
};

export const useNote = (id: NoteID): Note | null => {
  const cache = useContext(NoteCacheContext);

  useEffect(() => {
    window.requestIdleCallback(() => cache.loadNote(id));
  }, []);

  const note = useMemo(() => cache.notes.get(id) || null, [cache.notes, id]);

  return note;
};

export const NoteCacheContext = React.createContext<NoteCache>({
  loaded: false,
  notes: new Map(),
  loadNote: (id) => Promise.resolve(),
  setNote: (id, markdown) => {},
  deleteNote: (id) => {},
});
