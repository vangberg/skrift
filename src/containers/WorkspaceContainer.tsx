import React, { useEffect, useReducer, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import { Notes } from "../interfaces/notes";

export const WorkspaceContainer: React.FC<RouteComponentProps> = () => {
  const [store] = useState(() => new Store());

  const [state, dispatch] = useReducer(reducer, {}, () => ({
    notes: new Map(),
    openIds: [],
    search: {
      query: "",
      results: []
    }
  }));
  useEffect(() => {
    return store.events.update.subscribe(() => {
      const { notes } = store;
      dispatch({
        type: "SET_NOTES",
        notes
      });
      dispatch({
        type: "OPEN_NOTES",
        ids: Notes.byDate(notes)
          .map(note => note.id)
          .slice(0, 3)
      });
    });
  }, [store]);

  const [search] = useState(() => new Search());
  useEffect(() => {
    return search.subscribe(store);
  }, [search, store]);
  useEffect(() => {
    const { query } = state.search;
    console.log({ query });

    if (query === "") {
      dispatch({ type: "@search/SET_RESULTS", results: [] });
    } else {
      search.search(query).then(results => {
        dispatch({ type: "@search/SET_RESULTS", results });
      });
    }
  }, [state.search.query, search]);

  useEffect(() => {
    store.readAll();
  }, [store]);

  return (
    <StoreContext.Provider value={store}>
      <SearchContext.Provider value={search}>
        <StateContext.Provider value={[state, dispatch]}>
          <Workspace openIds={state.openIds} />
        </StateContext.Provider>
      </SearchContext.Provider>
    </StoreContext.Provider>
  );
};
