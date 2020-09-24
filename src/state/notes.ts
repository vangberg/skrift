import {
  ActionHandler,
  SetNotesAction,
  SetNoteAction,
  DeleteNoteAction,
} from "./types";
import { NoteIndex } from "../interfaces/noteIndex";
import produce from "immer";
import { Effects } from "react-use-elmish";

export const setNotes: ActionHandler<SetNotesAction> = (state, action) => {
  const notes: NoteIndex = new Map();

  action.notes.forEach((note) => {
    notes.set(note.id, NoteIndex.toEntry(note));
  });

  return [
    produce(state, (draft) => {
      draft.notes = notes;
    }),
    Effects.none(),
  ];
};

export const setNote: ActionHandler<SetNoteAction> = (state, action) => {
  const { note } = action;

  return [
    produce(state, (draft) => {
      draft.notes.set(note.id, NoteIndex.toEntry(note));
    }),
    Effects.none(),
  ];
};

export const deleteNote: ActionHandler<DeleteNoteAction> = (state, action) => {
  const { id } = action;

  return [
    produce(state, (draft) => {
      draft.notes.delete(id);
    }),
    Effects.none(),
  ];
};
