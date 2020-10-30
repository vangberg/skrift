import React from "react";
import { SearchBar } from "./SearchBar";
import { NoteID } from "../../interfaces/note";
import { NoteLinkContainer } from "../../containers/NoteLinkContainer";
import { Draggable } from "react-beautiful-dnd";
import { useUniqueId } from "../../useUniqueId";
import { StreamLocation } from "../../interfaces/streams";
import { Toolbar } from "./Toolbar";

type Props = {
  location: StreamLocation;
  query: string;
  results: NoteID[];
  onOpen: (id: string, push: boolean) => void;
  onClose: () => void;
  onAdd: (title: string) => void;
  onSearch: (query: string) => void;
};

export const StreamSearch: React.FC<Props> = ({
  location,
  query,
  results,
  onOpen,
  onClose,
  onAdd,
  onSearch,
}) => {
  const draggableId = useUniqueId();

  return (
    // eslint-disable-next-line react/jsx-key
    <Draggable draggableId={`stream-card-${draggableId}`} index={location[1]}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shadow rounded mx-2 mb-2 px-2 bg-white"
        >
          <div className="float-right pt-2 pr-2">
            <Toolbar
              onClose={onClose}
              draggableProps={provided.dragHandleProps}
            />
          </div>

          <div className="flex flex-col overflow-hidden">
            <SearchBar query={query} onAdd={onAdd} onSearch={onSearch} />

            <div className="overflow-y-auto">
              {results.map((id) => (
                <NoteLinkContainer key={id} id={id} onOpen={onOpen} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
