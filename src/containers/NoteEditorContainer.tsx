import React, { useContext, useMemo, useCallback, useEffect } from "react";
import { StateContext } from "../state";
import { Editor } from "../components/Editor";
import { StoreContext } from "../store";
import { Note } from "../interfaces/note";

interface Props {
  id: string;
}

export const NoteEditorContainer: React.FC<Props> = ({ id }) => {
  const store = useContext(StoreContext);
  const [state, dispatch] = useContext(StateContext);
  const note = useMemo(() => state.notes.get(id), [state, id]);

  const handleUpdate = useCallback(
    (markdown: string) => {
      store.save(id, Note.fromMarkdown(markdown));
    },
    [store, id]
  );
  const handleOpen = useCallback(id => dispatch({ type: "OPEN_NOTE", id }), []);
  const handleClose = useCallback(() => dispatch({ type: "CLOSE_NOTE", id }), [
    id,
    dispatch
  ]);
  const getNote = useCallback(id => state.notes.get(id), [state]);

  if (!note) {
    return null;
  }

  return (
    <Editor
      note={note}
      getNote={getNote}
      onOpen={handleOpen}
      onClose={handleClose}
      onUpdate={handleUpdate}
    />
  );
};
