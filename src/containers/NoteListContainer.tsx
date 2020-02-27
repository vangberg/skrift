import React, { useContext, useCallback, useMemo } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Notes } from "../interfaces/notes";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { search } = state;

  const notes = useMemo(() => {
    const { notes } = state;
    const { results } = search;

    if (results) {
      return Notes.getByIds(notes, results);
    }

    return Notes.byDate(state.notes);
  }, [state, search]);

  const handleAdd = useCallback(
    title => {
      const id = new Date().toJSON();
      dispatch({ type: "SAVE_MARKDOWN", id, markdown: `# ${title}` });
      dispatch({ type: "OPEN_NOTE", id });
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    query => dispatch({ type: "@search/SET_QUERY", query }),
    [dispatch]
  );

  const handleOpen = useCallback(id => dispatch({ type: "OPEN_NOTE", id }), [
    dispatch
  ]);

  return (
    <NoteList
      notes={notes}
      query={search.query}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onSearch={handleSearch}
    />
  );
};
