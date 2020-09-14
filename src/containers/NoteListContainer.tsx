import React, { useContext, useCallback, useMemo } from "react";
import { NoteList } from "../components/NoteList";
import { StateContext } from "../state";
import { Streams } from "../interfaces/streams";
import { NoteCache } from "../interfaces/noteCache";
import { IpcSetNote } from "../types";
import { Serializer } from "../interfaces/serializer";
import { ipcRenderer } from "electron";

export const NoteListContainer: React.FC = () => {
  const [state, dispatch] = useContext(StateContext);
  const { notes, search } = state;
  const { results } = search;

  const notes_ = useMemo(() => {
    if (results) {
      return NoteCache.byIds(notes, results);
    } else {
      return NoteCache.byModifiedAt(notes).slice(0, 100);
    }
  }, [results, notes]);

  const handleAdd = useCallback(
    (title) => {
      const id = new Date().toJSON();
      const slate = Serializer.deserialize(`# ${title}`);
      const message: IpcSetNote = { id, slate };
      ipcRenderer.send("set-note", message);
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
      notes={notes_}
      query={search.query}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onSearch={handleSearch}
    />
  );
};
