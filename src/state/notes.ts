import produce from "immer";
import { Effects } from "react-use-elmish";
import { Notes } from "../interfaces/notes";
import { NotesFS } from "../interfaces/notes_fs";

import {
  Action,
  OpenFolderAction,
  SetNotesAction,
  SaveMarkdownAction,
  DeleteNoteAction,
  ActionHandler,
} from "./types";
import { errorHandler } from "./errorHandler";
import { Search } from "../search";

export const openFolder: ActionHandler<OpenFolderAction> = (state) => {
  return [
    state,
    Effects.dispatchFromPromise<Action>(async () => {
      await NotesFS.initialize();
      const notes = await NotesFS.readAll();
      return { type: "notes/SET_NOTES", notes };
    }, errorHandler),
  ];
};

export const setNotes: ActionHandler<SetNotesAction> = (state, action) => {
  return [
    produce(state, (draft) => {
      draft.notes = action.notes;
    }),
    Effects.attemptFunction(
      () => Search.replaceAll(state.search.index, action.notes),
      errorHandler
    ),
  ];
};

export const saveMarkdown: ActionHandler<SaveMarkdownAction> = (
  state,
  action
) => {
  const next = produce(state, (draft) => {
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
      Effects.attemptFunction(
        () => Search.add(state.search.index, note),
        errorHandler
      )
    ),
  ];
};

export const deleteNote: ActionHandler<DeleteNoteAction> = (state, action) => {
  return [
    produce(state, (draft) => {
      Notes.deleteNote(draft.notes, action.id);
    }),
    Effects.combine(
      Effects.attemptPromise(() => NotesFS.delete(action.id), errorHandler),
      Effects.attemptFunction(
        () => Search.remove(state.search.index, action.id),
        errorHandler
      )
    ),
  ];
};
