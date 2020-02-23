import React, { useEffect, useReducer, useState } from "react";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import { Notes } from "../interfaces/notes";

export const WorkspaceContainer: React.FC = () => {
  const [store, setStore] = useState(() => new Store());

  const [search] = useState(() => new Search());

  useEffect(() => {
    search.subscribe(store);
  }, []);

  const [state, dispatch] = useReducer(reducer, {}, () => ({
    notes: new Map(),
    openIds: []
  }));

  useEffect(() => {
    const unsubscribe = store.events.update.subscribe(ids => {
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
    return unsubscribe;
  }, [store]);

  useEffect(() => {
    store.readAll();
  }, []);

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
