import React, { useMemo, useCallback } from "react";
import { Note } from "../../interfaces/note";
import isHotkey from "is-hotkey";

type Props = {
  id: string;
  getNote: (id: string) => Note | undefined;
  onOpen: (id: string, push: boolean) => void;
};

export const NoteLink: React.FC<Props> = ({ id, getNote, onOpen }) => {
  const note = useMemo(() => getNote(id), [getNote, id]);

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
