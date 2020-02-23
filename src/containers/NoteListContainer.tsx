import React, { useContext, useCallback } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { StoreContext } from "../store";
import { SearchContext } from "../search";

export const NoteListContainer: React.FC = () => {
  const store = useContext(StoreContext);
  const search = useContext(SearchContext);
  const [state, dispatch] = useContext(StateContext);
  const { notes } = state;

  const handleAdd = useCallback(
    title => {
      const [id] = store.generate(`# ${title}`);
      dispatch({ type: "OPEN_NOTE", id });
    },
    [store, dispatch]
  );

  const handleOpen = useCallback(id => dispatch({ type: "OPEN_NOTE", id }), [
    dispatch
  ]);

  return <NoteList notes={notes} onAdd={handleAdd} onOpen={handleOpen} />;
};
