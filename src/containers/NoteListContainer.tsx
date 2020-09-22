import React, { useContext, useCallback, useMemo } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Streams } from "../interfaces/streams";
import { NoteCache } from "../interfaces/noteCache";
import { Serializer } from "../interfaces/serializer";
import { Ipc } from "../interfaces/ipc";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { notes, search } = state;
  const { query, results } = search;

  const notes_ = useMemo(() => {
    if (query === "") {
      return NoteCache.byModifiedAt(notes).slice(0, 100);
    } else {
      return NoteCache.byIds(notes, results);
    }
  }, [query, results, notes]);

  const handleAdd = useCallback(
    (title) => {
      const id = new Date().toJSON();
      const slate = Serializer.deserialize(`# ${title}`);
      Ipc.send({ type: "command/ADD_NOTE", id, slate });
      dispatch({ type: "streams/OPEN_NOTE", stream: 0, id });
      dispatch({ type: "search/SET_QUERY", query: "" });
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    (query) => {
      dispatch({ type: "search/SET_QUERY", query });
      Ipc.send({ type: "command/SEARCH", query });
    },
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
      notes={notes_}
      query={search.query}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onSearch={handleSearch}
    />
  );
};
