import React, { useCallback } from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";

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
    <div>
      <SearchBar />
      <ul className="pt-2">
        {ids.map(id => (
          <ListItem key={id} id={id} onClick={() => handleClick(id)} />
        ))}
      </ul>
    </div>
  );
};
