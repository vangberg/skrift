import produce from "immer";
import { Effects } from "react-use-elmish";

import { ActionHandler, OpenNoteAction, CloseNoteAction } from "./types";
import { Streams } from "../interfaces/streams";

export const openNote: ActionHandler<OpenNoteAction> = (state, action) => {
  const { streamIndex, id } = action;

  return [
    produce(state, draft => {
      Streams.openNote(draft.streams, streamIndex, id);
    }),
    Effects.none()
  ];
};

export const closeNote: ActionHandler<CloseNoteAction> = (state, action) => {
  const { location } = action;

  return [
    produce(state, draft => {
      Streams.closeNote(draft.streams, location);
    }),
    Effects.none()
  ];
};
