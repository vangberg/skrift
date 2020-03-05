import React, { useContext, useMemo, useCallback } from "react";
import { StateContext } from "../state";
import { Editor } from "../components/Editor";
import { NoteID } from "../interfaces/note";
import { Notes } from "../interfaces/notes";
import { StreamLocation } from "../interfaces/streams";

interface Props {
  id: NoteID;
  location: StreamLocation;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, location }) => {
  const [state, dispatch] = useContext(StateContext);
  const [streamIndex] = location;

  const handleUpdate = useCallback(
    (markdown: string) =>
      dispatch({ type: "notes/SAVE_MARKDOWN", id, markdown }),
    [dispatch, id]
  );

  const handleDelete = useCallback(() => {
    dispatch({ type: "streams/CLOSE_NOTE", location });
    dispatch({ type: "notes/DELETE_NOTE", id });
  }, [dispatch, id, location]);

  const handleOpen = useCallback(
    id => dispatch({ type: "streams/OPEN_NOTE", streamIndex, noteId: id }),
    [dispatch, streamIndex]
  );

  const handleClose = useCallback(
    () => dispatch({ type: "streams/CLOSE_NOTE", location }),
    [dispatch, location]
  );

  const getNote = useCallback(id => Notes.getNote(state.notes, id), [state]);
  const note = useMemo(() => Notes.getNote(state.notes, id), [state, id]);

  if (!note) {
    return <div>Could not find note with ID {id}</div>;
  }

  return (
    <Editor
      note={note}
      getNote={getNote}
      onOpen={handleOpen}
      onDelete={handleDelete}
      onClose={handleClose}
      onUpdate={handleUpdate}
    />
  );
};
