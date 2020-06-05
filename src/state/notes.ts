import { ActionHandler, SetNotesAction, SetNoteAction } from "./types";
import { NoteCache } from "../interfaces/noteCache";
import produce from "immer";
import { Effects } from "react-use-elmish";

export const setNotes: ActionHandler<SetNotesAction> = (state, action) => {
  const notes: NoteCache = new Map();

  action.notes.forEach((note) => {
    notes.set(note.id, NoteCache.toEntry(note));
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
      draft.notes.set(note.id, NoteCache.toEntry(note));
    }),
    Effects.none(),
  ];
};
