import React, { useCallback } from "react";
import { NoteID } from "../../interfaces/note";
import { NoteIndexEntry } from "../../interfaces/noteIndex";

type Props = {
  id: NoteID;
  note: NoteIndexEntry | null;
  onOpen: (id: string, push: boolean) => void;
};

export const NoteLink: React.FC<Props> = ({ id, note, onOpen }) => {
  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      onOpen(id, event.metaKey || event.ctrlKey);
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
