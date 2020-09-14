import produce from "immer";
import { Effects } from "react-use-elmish";
import {
  ActionHandler,
  SetQueryAction,
  SetResultsAction,
  ClearSearchAction,
} from "./types";
import { errorHandler } from "./errorHandler";
import { ipcRenderer } from "electron";
import { IpcSearch } from "../types";

export const setQuery: ActionHandler<SetQueryAction> = (state, action) => {
  const { query } = action;

  if (query === "") {
    return [state, Effects.action({ type: "search/CLEAR" })];
  }

  return [
    produce(state, (draft) => {
      draft.search.query = query;
    }),
    Effects.attemptFunction(() => {
      const message: IpcSearch = { query };
      ipcRenderer.send("search", message);
    }, errorHandler),
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

export const clearSearch: ActionHandler<ClearSearchAction> = (state) => {
  return [
    produce(state, (draft) => {
      draft.search.query = "";
      draft.search.results = null;
    }),
    Effects.none(),
  ];
};
