import React, { useEffect, useContext, useReducer, useState } from "react";
import { reducer, StateContext } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";

export const WorkspaceContainer: React.FC = () => {
  const [store, _] = useState(() => new Store());

  const [state, dispatch] = useReducer(reducer, {}, () => {
    const notes = store.getNotes();
    return {
      notes,
      openIds: []
    };
  });

  useEffect(() => {
    (async () => {
      await store.readAll();
      const notes = store.getNotes();
      dispatch({
        type: "SET_NOTES",
        notes
      });
      dispatch({
        type: "OPEN_NOTES",
        ids: [...notes.keys()].slice(0, 3)
      });
    })();
  }, []);

  useEffect(() => {
    const id = store.subscribe(() => {
      dispatch({
        type: "SET_NOTES",
        notes: store.getNotes()
      });
    });
    return () => store.unsubscribe(id);
  }, [store]);

  return (
    <StoreContext.Provider value={store}>
      <StateContext.Provider value={[state, dispatch]}>
        <Workspace />
      </StateContext.Provider>
    </StoreContext.Provider>
  );
};
