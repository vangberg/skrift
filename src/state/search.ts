import produce from "immer";
import { Effects } from "react-use-elmish";
import { ActionHandler, SetQueryAction, SetResultsAction } from "./types";

export const setQuery: ActionHandler<SetQueryAction> = (state, action) => {
  const { query } = action;

  return [
    produce(state, (draft) => {
      draft.search.query = query;
    }),
    Effects.none(),
  ];
};

export const setResults: ActionHandler<SetResultsAction> = (state, action) => {
  return [
    produce(state, (draft) => {
      draft.search.results = action.results;
    }),
    Effects.none(),
  ];
};
