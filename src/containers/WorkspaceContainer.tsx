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
      openIds: []
    };
  });

  useEffect(() => {
    const id = store.subscribe(() => {
      const notes = store.getNotes();
      console.log("set notes", notes);
      dispatch({
        type: "SET_NOTES",
        notes
      });
    });
    return () => store.unsubscribe(id);
  }, [store]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};
