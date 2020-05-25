import React, { useContext, useCallback, useState, useEffect } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Streams } from "../interfaces/streams";
import { NotesFS } from "../interfaces/notes_fs";
import { NoteID } from "../interfaces/note";
import { NoteCacheContext } from "../noteCache";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { search } = state;

  const noteCache = useContext(NoteCacheContext);

  const [ids, setIds] = useState<NoteID[]>([]);

  useEffect(() => {
    NotesFS.ids(state.path).then((ids) => setIds(ids));
  }, [state.path]);

  const handleAdd = useCallback(
    (title) => {
      const id = new Date().toJSON();
      noteCache.setNote(id)(`# ${title}`);
      dispatch({ type: "streams/OPEN_NOTE", stream: 0, id });
    },
    [noteCache, dispatch]
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
      ids={ids}
      query={search.query}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onSearch={handleSearch}
    />
  );
};
