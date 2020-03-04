import produce from "immer";
import { Effects } from "react-use-elmish";

import { ActionHandler, OpenNoteAction, CloseNoteAction } from "./types";

export const openNote: ActionHandler<OpenNoteAction> = (state, action) => {
  return [
    produce(state, ({ openIds }) => {
      openIds.push(action.id);
    }),
    Effects.none()
  ];
};

export const closeNote: ActionHandler<CloseNoteAction> = (state, action) => {
  return [
    produce(state, draft => {
      const { index } = action;
      draft.openIds.splice(index, 1);
    }),
    Effects.none()
  ];
};
