import React, { useEffect, useContext, useReducer } from "react";
import { reducer, StateContext } from "../state";
import { StoreContext } from "../store";
import { Workspace } from "../components/Workspace";

export const WorkspaceContainer: React.FC = () => {
  const store = useContext(StoreContext);
  const [state, dispatch] = useReducer(reducer, {}, () => {
    const notes = store.getNotes();
    return {
      notes,
      openIds: [...notes.keys()].slice(0, 3)
    };
  });

  useEffect(() => {
    store.onUpdate(() =>
      dispatch({
        type: "SET_NOTES",
        notes: store.getNotes()
      })
    );
  }, [store]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};