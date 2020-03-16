import React, { useContext, useCallback, useMemo } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Notes } from "../interfaces/notes";
import { Streams } from "../interfaces/streams";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { search } = state;

  const notes = useMemo(() => {
    const { notes } = state;
    const { results } = search;

    if (results) {
      return Notes.getByIds(notes, results);
    }

    return Notes.byModifiedAt(state.notes).reverse();
  }, [state, search]);

  const handleAdd = useCallback(
    title => {
      const id = new Date().toJSON();
      dispatch({ type: "notes/SAVE_MARKDOWN", id, markdown: `# ${title}` });
      dispatch({ type: "streams/OPEN_NOTE", stream: 0, id });
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    query => dispatch({ type: "search/SET_QUERY", query }),
    [dispatch]
  );

  const handleOpen = useCallback(
    (id, push) => {
      // cmd/ctrl-click should open note in a new stream
      const stream = push ? Streams.next(state.streams) : 0;
      dispatch({ type: "streams/OPEN_NOTE", stream, id });
    },
    [dispatch, state.streams]
  );

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
