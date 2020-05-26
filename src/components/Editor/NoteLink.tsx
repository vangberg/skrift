import React, { useCallback } from "react";
import { Note, NoteID } from "../../interfaces/note";

type Props = {
  id: NoteID;
  note: Note | null;
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
    <span>
      <span className="text-gray-500 tracking-wider">[[</span>
      <span
        className="underline text-blue-600 cursor-pointer"
        onClick={handleOpen}
      >
        {note?.title || id}
      </span>
      <span className="text-gray-500 tracking-wider">]]</span>
    </span>
  );
};
