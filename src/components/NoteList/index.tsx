import React, { useCallback } from "react";
import { NoteListItem } from "./NoteListItem";

type Props = {
  ids: string[];
  onSelectNote?: (id: string) => void;
};

export const NoteList: React.FC<Props> = ({ ids, onSelectNote }) => {
  const handleClick = useCallback(
    (id: string) => {
      if (onSelectNote) {
        onSelectNote(id);
      }
    },
    [onSelectNote]
  );

  return (
    <ul>
      {ids.map(id => (
        <NoteListItem key={id} id={id} onClick={() => handleClick(id)} />
      ))}
    </ul>
  );
};
