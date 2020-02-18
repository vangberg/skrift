import React, { useMemo, useCallback } from "react";
import { Note } from "../../interfaces/note";

type Props = {
  id: string;
  getNote: (id: string) => Note;
  onOpen: (id: string) => void;
};

export const NoteLink: React.FC<Props> = ({ id, getNote, onOpen }) => {
  const note = useMemo(() => getNote(id), [getNote]);

  const handleOpen = useCallback(() => onOpen(id), [onOpen]);

  return (
    <span>
      <span className="text-gray-500">[[</span>
      <span
        className="underline text-blue-600 cursor-pointer"
        onClick={handleOpen}
      >
        {note.title}
      </span>
      <span className="text-gray-500">]]</span>
    </span>
  );
};
