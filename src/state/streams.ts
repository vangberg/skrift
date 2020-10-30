import produce from "immer";
import { Effects } from "react-use-elmish";

import {
  ActionHandler,
  OpenNoteAction,
  CloseNoteAction,
  MoveNoteAction,
  OpenSearchAction,
} from "./types";
import { Streams } from "../interfaces/streams";

export const openSearch: ActionHandler<OpenSearchAction> = (state, action) => {
  const { stream } = action;

  return [
    produce(state, (draft) => {
      Streams.openSearch(draft.streams, stream);
    }),
    Effects.none(),
  ];
};

export const openNote: ActionHandler<OpenNoteAction> = (state, action) => {
  const { stream, id } = action;

  return [
    produce(state, (draft) => {
      Streams.openNote(draft.streams, stream, id);
    }),
    Effects.none(),
  ];
};

export const closeNote: ActionHandler<CloseNoteAction> = (state, action) => {
  const { location } = action;

  return [
    produce(state, (draft) => {
      Streams.closeNote(draft.streams, { location });
    }),
    Effects.none(),
  ];
};

export const moveNote: ActionHandler<MoveNoteAction> = (state, action) => {
  const { from, to } = action;

  return [
    produce(state, (draft) => {
      Streams.move(draft.streams, from, to);
    }),
    Effects.none(),
  ];
};
