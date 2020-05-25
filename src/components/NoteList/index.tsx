import React from "react";
import { SearchBar } from "./SearchBar";
import { NoteID } from "../../interfaces/note";
import { NoteListItemContainer } from "../../containers/NoteListItemContainer";

type Props = {
  ids: NoteID[];
  query: string;
  onOpen: (id: string, push: boolean) => void;
  onAdd: (title: string) => void;
  onSearch: (query: string) => void;
};

export const NoteList: React.FC<Props> = ({
  ids,
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
          {ids.map((id) => (
            <NoteListItemContainer key={id} id={id} onClick={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
};
