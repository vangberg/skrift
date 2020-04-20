import React from "react";
import { ListItem } from "./ListItem";
import { SearchBar } from "./SearchBar";
import { Note } from "../../interfaces/note";

type Props = {
  notes: Note[];
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
    <div className="flex flex-col w-full">
      <SearchBar query={query} onAdd={onAdd} onSearch={onSearch} />

      <div className="w-full overflow-y-auto">
        <div className="w-full pt-0">
          {notes.map((note) => (
            <ListItem key={note.id} note={note} onClick={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
};
