import React from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";
import { Notes } from "../../store";

type Props = {
  notes: Notes;
  onOpen: (id: string) => void;
  onAdd: (title: string) => void;
};

export const NoteList: React.FC<Props> = ({ notes, onOpen, onAdd }) => {
  return (
    <div>
      <SearchBar onAdd={onAdd} />

      <div className="pt-2">
        {[...notes]
          .sort((n1, n2) => n1[1].title.localeCompare(n2[1].title))
          .map(([id, note]) => (
            <ListItem key={id} id={id} note={note} onClick={() => onOpen(id)} />
          ))}
      </div>
    </div>
  );
};
