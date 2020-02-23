import React, { useContext, useCallback, useMemo, useState } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { StoreContext } from "../store";
import { SearchContext } from "../search";
import { Notes } from "../interfaces/notes";

export const NoteListContainer: React.FC = () => {
  const store = useContext(StoreContext);
  const [state, dispatch] = useContext(StateContext);

  const search = useContext(SearchContext);
  const [query, setQuery] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  const notes = useMemo(() => Notes.byDate(store.notes), [state, store]);

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
