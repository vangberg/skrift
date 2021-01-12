import React from "react";
import { useNote } from "../hooks/useNote";
import { NoteID } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";

interface Props {
  id: NoteID;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, onOpen }) => {
  const note = useNote(id);

  if (!note) {
    return null;
  }

  return (
    <div>
      <h1>{note.title}</h1>
      {note.body}
    </div>
  );
};
