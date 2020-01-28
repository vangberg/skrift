import React, { useContext, useMemo, useCallback } from "react";
import { NotesContext } from "../../notesContext";
import { NoteEditor } from "./NoteEditor";
import { StoreContext } from "../../store";
import { Note } from "../../interfaces/note";

type Props = {
  id: string;
  onClose: (id: string) => void;
};

export const NoteEditorContainer: React.FC<Props> = ({ id, onClose }) => {
  const store = useContext(StoreContext);
  const notes = useContext(NotesContext);
  const note = useMemo(() => notes.get(id), [notes, id]);

  const handleUpdate = useCallback(
    (markdown: string) => store.save(id, Note.fromMarkdown(markdown)),
    [store, id]
  );
  const handleClose = useCallback(() => onClose(id), [id, onClose]);

  if (!note) {
    return null;
  }

  return (
    <NoteEditor note={note} onClose={handleClose} onUpdate={handleUpdate} />
  );
};
