import React, { useContext, useMemo, useCallback } from "react";
import { StateContext } from "../state";
import { Editor } from "../components/Editor";
import { NoteID, Note } from "../interfaces/note";
import { Notes } from "../interfaces/notes";
import { StreamLocation } from "../interfaces/streams";
import { useNote, NoteCacheContext } from "../noteCache";

interface Props {
  id: NoteID;
  location: StreamLocation;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, location }) => {
  const [state, dispatch] = useContext(StateContext);
  const [stream] = location;
  const noteCache = useContext(NoteCacheContext);
  const note = useNote(id);

  const handleUpdate = useCallback(
    (markdown: string) => noteCache.setNote(id, markdown),
    [noteCache, id]
  );

  const handleDelete = useCallback(() => {
    dispatch({ type: "streams/CLOSE_NOTE", location });
    noteCache.deleteNote(id);
  }, [dispatch, id, location, noteCache]);

  const handleOpen = useCallback(
    (id, push) => {
      const idx = push ? stream + 1 : stream;
      dispatch({ type: "streams/OPEN_NOTE", stream: idx, id });
    },
    [dispatch, stream]
  );

  const handleClose = useCallback(
    () => dispatch({ type: "streams/CLOSE_NOTE", location }),
    [dispatch, location]
  );

  if (!note) {
    return <div>Could not find note with ID {id}</div>;
  }

  return (
    <Editor
      note={note}
      onOpen={handleOpen}
      onDelete={handleDelete}
      onClose={handleClose}
      onUpdate={handleUpdate}
    />
  );
};
