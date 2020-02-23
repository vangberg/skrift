import React from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";
import { Note } from "../../interfaces/note";

type Props = {
  notes: Note[];
  onOpen: (id: string) => void;
  onAdd: (title: string) => void;
};

export const NoteList: React.FC<Props> = ({ notes, onOpen, onAdd }) => {
  return (
    <div>
      <SearchBar onAdd={onAdd} />

      <div className="pt-2">
        {notes.map(note => (
          <ListItem key={note.id} note={note} onClick={onOpen} />
        ))}
      </div>
    </div>
  );
};
