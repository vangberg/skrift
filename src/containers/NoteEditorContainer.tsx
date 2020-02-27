import React, { useContext, useMemo, useCallback } from "react";
import { StateContext } from "../state";
import { Editor } from "../components/Editor";
import { NoteID } from "../interfaces/note";
import { Notes } from "../interfaces/notes";

interface Props {
  id: NoteID;
}

export const NoteEditorContainer: React.FC<Props> = ({ id }) => {
  const [state, dispatch] = useContext(StateContext);

  const handleUpdate = useCallback(
    (markdown: string) => dispatch({ type: "SAVE_MARKDOWN", id, markdown }),
    [dispatch, id]
  );

  const handleDelete = useCallback(() => {
    dispatch({ type: "CLOSE_NOTE", id });
    dispatch({ type: "DELETE_NOTE", id });
  }, [dispatch, id]);

  const handleOpen = useCallback(id => dispatch({ type: "OPEN_NOTE", id }), [
    dispatch
  ]);

  const handleClose = useCallback(() => dispatch({ type: "CLOSE_NOTE", id }), [
    dispatch,
    id
  ]);

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
