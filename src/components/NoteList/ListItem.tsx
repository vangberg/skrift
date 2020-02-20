import React, { useCallback } from "react";
import { Note } from "../../interfaces/note";
import { clipboard } from "electron";

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

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${id}]]`);
  }, []);

  return (
    <div className="flex text-sm">
      <div
        className="flex-1 p-1 cursor-pointer hover:bg-gray-300 truncate"
        onClick={handleClick}
      >
        {note.title || id}
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
