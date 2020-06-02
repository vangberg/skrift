import React, { useContext, useCallback } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Streams } from "../interfaces/streams";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { search } = state;

  const handleAdd = useCallback(
    (title) => {
      const id = new Date().toJSON();
      dispatch({ type: "streams/OPEN_NOTE", stream: 0, id });
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    (query) => dispatch({ type: "search/SET_QUERY", query }),
    [dispatch]
  );

  const handleOpen = useCallback(
    (id, push) => {
      // cmd/ctrl-click should open note in a new stream
      const stream = push
        ? Streams.next(state.streams)
        : Streams.last(state.streams);
      dispatch({ type: "streams/OPEN_NOTE", stream, id });
    },
    [dispatch, state.streams]
  );

  return (
    <NoteList
      notes={Array.from(state.notes.values())}
      query={search.query}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onSearch={handleSearch}
    />
  );
};
