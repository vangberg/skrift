import React from "react";
import { SearchBar } from "./SearchBar";
import { ListItem } from "./ListItem";
import { NoteIndexEntry } from "../../interfaces/noteIndex";
import { Droppable } from "react-beautiful-dnd";

type Props = {
  notes: NoteIndexEntry[];
  query: string;
  onOpen: (id: string, push: boolean) => void;
  onAdd: (title: string) => void;
  onSearch: (query: string) => void;
};

export const NoteList: React.FC<Props> = ({
  notes,
  query,
  onOpen,
  onAdd,
  onSearch,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <SearchBar query={query} onAdd={onAdd} onSearch={onSearch} />

      <div className="overflow-y-auto">
          {notes.map((note) => (
            <ListItem key={note.id} note={note} onClick={onOpen} />
          ))}
      </div>
    </div>
  );
};
