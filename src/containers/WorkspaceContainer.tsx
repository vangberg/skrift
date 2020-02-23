import React, { useEffect, useReducer, useState } from "react";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import { Notes } from "../interfaces/notes";

export const WorkspaceContainer: React.FC = () => {
  const [store, setStore] = useState(() => new Store());

  const [search] = useState(() => new Search(store));

  useEffect(() => {
    const unsubscribe = store.events.update.subscribe(ids => {
      ids.forEach(id => {
        const note = store.get(id);
        search.add(id, note);
      });
    });
    return unsubscribe;
  }, [store]);

  const [state, dispatch] = useReducer(reducer, {}, () => ({
    notes: new Map(),
    openIds: []
  }));

  useEffect(() => {
    const unsubscribe = store.events.update.subscribe(ids => {
      const notes = store.getNotes();

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
          <Workspace />
        </StateContext.Provider>
      </SearchContext.Provider>
    </StoreContext.Provider>
  );
};
