import React, { useCallback } from "react";
import { Note, NoteID } from "../../interfaces/note";
import { clipboard } from "electron";

type Props = {
  note: Note;
  onClick?: (id: NoteID) => void;
};

export const ListItem: React.FC<Props> = ({ note, onClick }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(note.id);
    }
  }, [onClick]);

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, []);

  return (
    <div className="flex text-sm">
      <div
        className="flex-1 p-1 cursor-pointer hover:bg-gray-300 truncate"
        onClick={handleClick}
      >
        {note.title || note.id}
      </div>
      <div
        className="p-1 text-blue-400 underline cursor-pointer"
        onClick={handleCopy}
      >
        Copy
      </div>
    </div>
  );
};
