import React, { useCallback } from "react";
import { Editor } from "../Editor";
import { Close } from "./Close";
import { Note } from "../../interfaces/note";

type Props = {
  note: Note;
  getNote: (id: string) => Note;
  onUpdate: (markdown: string) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const NoteEditor: React.FC<Props> = ({
  note,
  getNote,
  onUpdate,
  onOpen,
  onClose
}) => {
  const handleUpdate = useCallback((markdown: string) => onUpdate(markdown), [
    onUpdate
  ]);

  return (
    <div className="shadow p-2 mb-2 bg-white">
      <div className="float-right">
        <Close onClick={onClose} />
      </div>
      <Editor
        markdown={note.markdown}
        getNote={getNote}
        onOpen={onOpen}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
