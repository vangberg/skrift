import React, { useCallback } from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";

type Props = {
  ids: string[];
  onSelectNote: (id: string) => void;
  onAddNote: (title: string) => void;
};

export const NoteList: React.FC<Props> = ({ ids, onSelectNote, onAddNote }) => {
  return (
    <div>
      <SearchBar onAdd={onAddNote} />
      <ul className="pt-2">
        {ids.map(id => (
          <ListItem key={id} id={id} onClick={() => onSelectNote(id)} />
        ))}
      </ul>
    </div>
  );
};
