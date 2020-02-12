import React, { useContext, useMemo, useCallback } from "react";
import { StateContext } from "../state";
import { NoteEditor } from "../components/NoteEditor";
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
    (markdown: string) => store.save(id, Note.fromMarkdown(markdown)),
    [store, id]
  );
  const handleClose = useCallback(() => dispatch({ type: "CLOSE_NOTE", id }), [
    id,
    dispatch
  ]);

  if (!note) {
    return null;
  }

  return (
    <NoteEditor note={note} onClose={handleClose} onUpdate={handleUpdate} />
  );
};
