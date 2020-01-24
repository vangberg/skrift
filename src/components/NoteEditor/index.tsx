import React, { useContext, useMemo, useCallback } from "react";
import { NotesContext } from "../../notesContext";
import { Editor } from "../Editor";

type Props = {
  id: string;
  onUpdate: (id: string, markdown: string) => void;
};

export const NoteEditor: React.FC<Props> = ({ id, onUpdate }) => {
  const notes = useContext(NotesContext);
  const note = useMemo(() => notes.get(id), [notes, id]);

  const handleUpdate = useCallback(
    (markdown: string) => onUpdate(id, markdown),
    [id, onUpdate]
  );

  if (!note) {
    return null;
  }

  return (
    <div className="shadow p-2 mb-2">
      <Editor markdown={note.markdown} onUpdate={handleUpdate} />
    </div>
  );
};
