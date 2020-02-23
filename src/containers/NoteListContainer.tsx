import React, { useContext, useCallback, useMemo } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { StoreContext } from "../store";
import { Notes } from "../interfaces/notes";

export const NoteListContainer: React.FC = () => {
  const store = useContext(StoreContext);
  const [state, dispatch] = useContext(StateContext);

  const notes = useMemo(() => {
    const {
      notes,
      search: { results }
    } = state;

    if (results) {
      return Notes.getByIds(notes, results);
    }

    return Notes.byDate(state.notes);
  }, [state]);

  const handleAdd = useCallback(
    title => {
      const { id } = store.generate(`# ${title}`);
      dispatch({ type: "OPEN_NOTE", id });
    },
    [store, dispatch]
  );

  const handleOpen = useCallback(id => dispatch({ type: "OPEN_NOTE", id }), [
    dispatch
  ]);

  return <NoteList notes={notes} onAdd={handleAdd} onOpen={handleOpen} />;
};
