import React, { useCallback } from "react";
import { Editor } from "../Editor";
import { Close } from "./Close";
import { Note } from "../../interfaces/note";

type Props = {
  note: Note;
  onUpdate: (markdown: string) => void;
  onClose: () => void;
};

export const NoteEditor: React.FC<Props> = ({ note, onUpdate, onClose }) => {
  const handleUpdate = useCallback((markdown: string) => onUpdate(markdown), [
    onUpdate
  ]);
  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <div className="shadow p-2 mb-2 bg-white">
      <div className="float-right">
        <Close onClick={handleClose} />
      </div>
      <Editor markdown={note.markdown} onUpdate={handleUpdate} />
    </div>
  );
};
