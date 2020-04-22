import React, { useCallback } from "react";
import { Note, NoteID } from "../../interfaces/note";
import { clipboard } from "electron";
import { Icon } from "../Icon";

type Props = {
  note: Note;
  onClick?: (id: NoteID, push: boolean) => void;
};

export const ListItem: React.FC<Props> = ({ note, onClick }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (onClick) {
        onClick(note.id, event.metaKey || event.ctrlKey);
      }
    },
    [onClick, note]
  );

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, [note]);

  return (
    <div className="flex group hover:bg-gray-200 px-2">
      <div
        className="flex-1 p-1 cursor-pointer text-gray-700 truncate"
        onClick={handleClick}
      >
        {note.title || note.id}
      </div>
      <div className="px-1 my-1 text-gray-700 cursor-pointer hover:bg-gray-400 rounded flex items-center invisible group-hover:visible">
        <Icon name="ellipsis-h" className="w-3" />
      </div>
    </div>
  );
};
