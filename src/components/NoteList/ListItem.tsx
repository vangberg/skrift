import React, { useCallback } from "react";
import { Note } from "../../interfaces/note";

type Props = {
  id: string;
  note: Note;
  onClick?: () => void;
};

export const ListItem: React.FC<Props> = ({ id, note, onClick }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <li
      className="p-1 cursor-pointer hover:bg-gray-300 text-sm truncate"
      onClick={handleClick}
    >
      {note.title || id}
    </li>
  );
};
