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
    store.onUpdate(() => {
      const notes = store.getNotes();
      dispatch({
        type: "SET_NOTES",
        notes
      });
      dispatch({
        type: "OPEN_NOTES",
        ids: [...notes.keys()].slice(0, 3)
      });
    });
  }, [store]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};
