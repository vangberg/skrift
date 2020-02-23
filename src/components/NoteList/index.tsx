import React from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";
import { Notes } from "../../interfaces/notes";

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
        {Notes.byDate(notes).map(([id, note]) => (
          <ListItem key={id} id={id} note={note} onClick={() => onOpen(id)} />
        ))}
      </div>
    </div>
  );
};
