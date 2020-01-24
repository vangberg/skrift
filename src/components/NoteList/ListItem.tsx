import React, { useContext, useMemo, useCallback } from "react";
import { NotesContext } from "../../notesContext";

type Props = {
  id: string;
  onClick?: () => void;
};

export const ListItem: React.FC<Props> = ({ id, onClick }) => {
  const notes = useContext(NotesContext);
  const note = useMemo(() => notes.get(id), [id, notes]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  if (!note) {
    return null;
  }

  return (
    <li
      className="p-1 cursor-pointer hover:bg-gray-300 text-sm truncate"
      onClick={handleClick}
    >
      {note.title || id}
    </li>
  );
};
