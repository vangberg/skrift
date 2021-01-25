import React, { useCallback } from "react";
import { Note, NoteID } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { mouseEventToMode } from "../mouseEventToMode";

type Props = {
  id: NoteID;
  note: Note | null;
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const NoteLink: React.FC<Props> = ({ id, note, onOpen }) => {
  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      onOpen(id, mouseEventToMode(event.nativeEvent));
    },
    [onOpen, id]
  );

  if (!note) {
    return <span>[[{id}]]</span>;
  }

  return (
    <span
      className="border-b border-blue-600 text-blue-600 cursor-pointer"
      onClick={handleOpen}
    >
      {note.title || id}
    </span>
  );
};
