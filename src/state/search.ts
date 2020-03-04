import produce from "immer";
import { Effects } from "react-use-elmish";
import {
  ActionHandler,
  SetQueryAction,
  SetResultsAction,
  ClearResultsAction
} from "./types";

export const setQuery: ActionHandler<SetQueryAction> = (state, action) => {
  return [
    produce(state, draft => {
      draft.search.query = action.query;
    }),
    Effects.none()
  ];
};

export const setResults: ActionHandler<SetResultsAction> = (state, action) => {
  return [
    produce(state, draft => {
      draft.search.results = action.results;
    }),
    Effects.none()
  ];
};

export const clearResults: ActionHandler<ClearResultsAction> = state => {
  return [
    produce(state, draft => {
      draft.search.results = null;
    }),
    Effects.none()
  ];
};
