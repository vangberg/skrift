import React, { useContext, useMemo, useCallback } from "react";
import { NotesContext } from "../../notesContext";
import { Editor } from "../Editor";
import { Close } from "./Close";

type Props = {
  id: string;
  onUpdate: (id: string, markdown: string) => void;
  onClose: (id: string) => void;
};

export const NoteEditor: React.FC<Props> = ({ id, onUpdate, onClose }) => {
  const notes = useContext(NotesContext);
  const note = useMemo(() => notes.get(id), [notes, id]);

  const handleUpdate = useCallback(
    (markdown: string) => onUpdate(id, markdown),
    [id, onUpdate]
  );

  const handleClose = useCallback(() => onClose(id), [id, onClose]);

  if (!note) {
    return null;
  }

  return (
    <div className="shadow p-2 mb-2 bg-white">
      <div className="float-right">
        <Close onClick={handleClose} />
      </div>
      <Editor markdown={note.markdown} onUpdate={handleUpdate} />
    </div>
  );
};
