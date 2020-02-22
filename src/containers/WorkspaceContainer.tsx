import React, { useEffect, useContext, useReducer, useState } from "react";
import FlexSearch from "flexsearch";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";

export const WorkspaceContainer: React.FC = () => {
  const [store, setStore] = useState(() => new Store());

  useEffect(() => {
    (async () => {
      const store = new Store();
      await store.readAll();
      setStore(store);
    })();
  }, []);

  const [index] = useState(() => {
    // @ts-ignore
    return new FlexSearch({ worker: true });
  });

  const [state, dispatch] = useReducer(reducer, {}, () => {
    return {
      notes: new Map(),
      openIds: []
    };
  });

  useEffect(() => {
    const notes = store.getNotes();

    dispatch({
      type: "SET_NOTES",
      notes
    });
    dispatch({
      type: "OPEN_NOTES",
      ids: [...notes.keys()].slice(0, 3)
    });

    const unsubscribe = store.events.update.subscribe(id => {
      dispatch({
        type: "SET_NOTES",
        notes: store.getNotes()
      });
    });
    return unsubscribe;
  }, [store]);

  return (
    <StoreContext.Provider value={store}>
      <StateContext.Provider value={[state, dispatch]}>
        <Workspace />
      </StateContext.Provider>
    </StoreContext.Provider>
  );
};
