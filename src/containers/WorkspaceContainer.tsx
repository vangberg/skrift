import React, { useEffect, useReducer, useState } from "react";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";
import { Search } from "../search";

export const WorkspaceContainer: React.FC = () => {
  const [store, setStore] = useState(() => new Store());

  const [index] = useState(() => new Search(store));

  useEffect(() => {
    const unsubscribe = store.events.update.subscribe(ids => {
      ids.forEach(id => {
        const note = store.get(id);
        index.add(id, note);
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
      console.log("UPDATE", ids.length);
      dispatch({
        type: "SET_NOTES",
        notes: store.getNotes()
      });
      dispatch({
        type: "OPEN_NOTES",
        ids: [...store.getNotes().keys()].slice(0, 3)
      });
    });
    return unsubscribe;
  }, [store]);

  useEffect(() => {
    store.readAll();
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <StateContext.Provider value={[state, dispatch]}>
        <Workspace />
      </StateContext.Provider>
    </StoreContext.Provider>
  );
};
